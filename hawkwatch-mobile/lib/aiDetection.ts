import OpenAI from "openai";

const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export interface VideoEvent {
    timestamp: string;
    description: string;
    isDangerous: boolean;
}

export interface PoseKeypoint {
    x: number;
    y: number;
    score?: number;
    name?: string;
}

export interface TensorFlowData {
    poseKeypoints: PoseKeypoint[];
    faceDetected: boolean;
    faceConfidence?: number;
}

export class AIDetectionService {
    private openai: OpenAI | null = null;

    constructor() {
        if (API_KEY) {
            this.openai = new OpenAI({
                apiKey: API_KEY,
            });
            console.log('✅ OpenAI initialized with API key');
        } else {
            console.warn('⚠️ EXPO_PUBLIC_OPENAI_API_KEY not set, AI detection will use mock data');
            console.log('💡 To enable real AI analysis:');
            console.log('   1. Get API key from: https://platform.openai.com/api-keys');
            console.log('   2. Add to .env: EXPO_PUBLIC_OPENAI_API_KEY=your_key_here');
            console.log('   3. Restart the app');
        }
    }

    async detectEvents(
        base64Image: string, 
        transcript: string = '',
        tensorflowData?: TensorFlowData
    ): Promise<{ events: VideoEvent[], rawResponse: string }> {
        console.log('Starting frame analysis with OpenAI Vision...');
        
        // If no image provided or no API key is available, return mock data
        if (!base64Image || !this.openai || !API_KEY) {
            console.log('Using mock analysis (no image or API key)');
            return this.getMockEvents();
        }

        try {
            // Ensure proper data URL format
            let imageUrl = base64Image;
            if (!imageUrl.startsWith('data:')) {
                imageUrl = `data:image/jpeg;base64,${base64Image}`;
            }

            // Build TensorFlow context for enhanced analysis
            let tensorflowContext = '';
            if (tensorflowData) {
                const { poseKeypoints, faceDetected, faceConfidence } = tensorflowData;
                
                if (faceDetected) {
                    tensorflowContext += `\nFace Detection: A face was detected with ${faceConfidence ? Math.round(faceConfidence * 100) + '% confidence' : 'high confidence'}.`;
                } else {
                    tensorflowContext += `\nFace Detection: No face is clearly visible (person may be turned away, fallen, or obscured).`;
                }
                
                if (poseKeypoints && poseKeypoints.length > 0) {
                    const visibleKeypoints = poseKeypoints.filter(kp => (kp.score || 0) > 0.3);
                    const keypointNames = visibleKeypoints.map(kp => kp.name).filter(Boolean);
                    
                    tensorflowContext += `\nPose Detection: ${visibleKeypoints.length} body keypoints detected (${keypointNames.join(', ')}).`;
                    
                    const avgY = visibleKeypoints.reduce((sum, kp) => sum + kp.y, 0) / visibleKeypoints.length;
                    if (avgY > 300) {
                        tensorflowContext += ` The person's body position appears LOW in the frame, which may indicate lying down, fallen, or slumped position.`;
                    }
                    
                    const hasHead = keypointNames.some(n => n?.includes('nose') || n?.includes('eye') || n?.includes('ear'));
                    const hasShoulders = keypointNames.some(n => n?.includes('shoulder'));
                    if (!hasHead && hasShoulders) {
                        tensorflowContext += ` Head/face keypoints are NOT visible but body is detected - person may be face-down or head is obscured.`;
                    }
                }
            }

            console.log('Sending image to OpenAI Vision...', { hasTensorflowData: !!tensorflowData });

            const prompt = `Analyze this frame and determine if any of these specific dangerous situations are occurring:

1. Medical Emergencies:
- Person unconscious or lying motionless
- Person clutching chest/showing signs of heart problems
- Seizures or convulsions
- Difficulty breathing or choking

2. Falls and Injuries:
- Person falling or about to fall
- Person on the ground after a fall
- Signs of injury or bleeding
- Limping or showing signs of physical trauma

3. Distress Signals:
- Person calling for help or showing distress
- Panic attacks or severe anxiety symptoms
- Signs of fainting or dizziness
- Headache or unease
- Signs of unconsciousness

4. Violence or Threats:
- Physical altercations
- Threatening behavior
- Weapons visible

5. Suspicious Activities:
- Shoplifting
- Vandalism
- Trespassing
${tensorflowContext ? `
TENSORFLOW ML DETECTION DATA (use this to enhance your analysis):
${tensorflowContext}
` : ''}${transcript ? `
AUDIO TRANSCRIPT from the scene: "${transcript}"
` : ''}
Return ONLY a JSON object in this exact format (no markdown, no code blocks):

{
    "events": [
        {
            "timestamp": "00:00",
            "description": "Brief description of what's happening in this frame",
            "isDangerous": true or false
        }
    ]
}`;

            try {
                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini", // Cost-effective vision model with good rate limits
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: prompt
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: imageUrl,
                                        detail: "low" // Use low detail for faster processing and lower cost
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.3
                });

                const text = response.choices[0]?.message?.content || '';
                console.log('Raw OpenAI Response:', text);

                // Try to extract JSON from the response
                let jsonStr = text;
                
                const codeBlockMatch = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
                if (codeBlockMatch) {
                    jsonStr = codeBlockMatch[1];
                    console.log('Extracted JSON from code block:', jsonStr);
                } else {
                    const jsonMatch = text.match(/\{[^]*\}/);  
                    if (jsonMatch) {
                        jsonStr = jsonMatch[0];
                        console.log('Extracted raw JSON:', jsonStr);
                    }
                }

                const parsed = JSON.parse(jsonStr);
                return {
                    events: parsed.events || [],
                    rawResponse: text
                };

            } catch (apiError: unknown) {
                console.error('OpenAI API call failed:', apiError);
                console.log('API key available:', !!API_KEY);
                return this.getMockEvents();
            }

        } catch (error) {
            console.error('Error in AI detection setup:', error);
            return this.getMockEvents();
        }
    }

    private getMockEvents(): { events: VideoEvent[], rawResponse: string } {
        const mockEvents = [
            { description: 'Person detected in frame', isDangerous: false },
            { description: 'Normal movement patterns observed', isDangerous: false },
            { description: 'Suspicious behavior detected - loitering', isDangerous: true },
            { description: 'Person appears distressed or in pain', isDangerous: true },
            { description: 'Fall detected - person on ground', isDangerous: true },
            { description: 'Regular activity - person walking normally', isDangerous: false },
            { description: 'Potential shoplifting behavior observed', isDangerous: true },
            { description: 'Person clutching chest - possible medical emergency', isDangerous: true },
            { description: 'Camera detecting motion in area', isDangerous: false },
            { description: 'AI analysis complete - no threats detected', isDangerous: false },
        ];
        
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        const currentTime = new Date();
        const timestamp = `${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`;
        
        if (Math.random() > 0.3) {
            console.log('Mock event generated:', randomEvent.description);
            const description = API_KEY ? 
                randomEvent.description + ' (API fallback)' : 
                randomEvent.description + ' (demo mode)';
                
            return {
                events: [{
                    timestamp,
                    description,
                    isDangerous: randomEvent.isDangerous
                }],
                rawResponse: API_KEY ? 'Mock fallback due to API error' : 'Demo mode - no API key provided'
            };
        }
        
        console.log('No mock event generated this time');
        return {
            events: [],
            rawResponse: 'No significant events detected'
        };
    }

    async captureFrameFromCamera(cameraRef: any): Promise<string | null> {
        try {
            console.log('Attempting to capture frame from camera...');
            
            if (!cameraRef || !cameraRef.current) {
                console.log('Camera ref not available');
                return null;
            }
            
            const photo = await cameraRef.current.takePictureAsync({
                base64: true,
                quality: 0.7,
                skipProcessing: true,
            });
            
            console.log('Photo captured:', { hasBase64: !!photo.base64, uri: photo.uri });
            
            if (photo.base64) {
                console.log('Successfully captured frame with base64 data');
                return `data:image/jpeg;base64,${photo.base64}`;
            }
            
            console.log('No base64 data in photo');
            return null;
        } catch (error) {
            console.error('Error capturing frame:', error);
            console.log('Using mock data due to capture failure');
            return null;
        }
    }
}

export const aiDetectionService = new AIDetectionService();
