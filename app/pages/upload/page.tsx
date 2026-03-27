"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Save, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import VideoPlayer from "@/components/video-player"
import TimestampList from "@/components/timestamp-list"
import type { Timestamp } from "@/app/types"
import { detectEvents, type VideoEvent } from "./actions"
import Link from "next/link"

interface SavedVideo {
  id: string
  name: string
  url: string
  thumbnailUrl: string
  timestamps: Timestamp[]
}

export default function UploadPage() {
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [timestamps, setTimestamps] = useState<Timestamp[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoName, setVideoName] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

  const captureFrame = async (video: HTMLVideoElement, time: number): Promise<string | null> => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Failed to get canvas context');
      return null;
    }

    try {
      video.currentTime = time;
    } catch (error) {
      console.error('Error setting video time:', error);
      return null;
    }
    
    // Wait for video to seek to the specified time
    await new Promise((resolve) => {
      video.onseeked = resolve;
    });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleFileUpload = async (e: { target: { files: FileList | null } }) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setTimestamps([])

    try {

      const localUrl = URL.createObjectURL(file)
      setVideoUrl(localUrl)
      setVideoName(file.name)

      // Wait for video element to be available
      while (!videoRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Set the source and wait for video to load
      const video = videoRef.current
      video.src = localUrl

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for video metadata'))
        }, 10000)

        const handleLoad = () => {
          clearTimeout(timeout)
          resolve(true)
        }

        const handleError = () => {
          clearTimeout(timeout)
          reject(new Error('Failed to load video: ' + video.error?.message))
        }

        video.addEventListener('loadeddata', handleLoad)
        video.addEventListener('error', handleError)

        if (video.readyState >= 2) {
          handleLoad()
        }

        return () => {
          video.removeEventListener('loadeddata', handleLoad)
          video.removeEventListener('error', handleError)
        }
      })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsUploading(false)
      setUploadProgress(100)

      // Start analysis
      setIsAnalyzing(true)
      const duration = video.duration
      
      if (!duration || duration === Infinity || isNaN(duration)) {
        throw new Error('Invalid video duration')
      }

      console.log('Video duration:', duration)
      const interval = 3 // Analyze one frame every 3 seconds
      const totalFrames = Math.floor(duration / interval)
      const newTimestamps: Timestamp[] = []

      // Process frames at regular intervals
      for (let time = 0; time < duration; time += interval) {
        const progress = Math.floor((time / duration) * 100)
        setUploadProgress(progress)
        console.log(`Analyzing frame at ${time}s (${progress}%)...`)

        const frame = await captureFrame(video, time)
        if (frame) {
          try {
            const result = await detectEvents(frame)
            console.log('Frame analysis result:', result)
            if (result.events && result.events.length > 0) {
              result.events.forEach((event: VideoEvent) => {
                const minutes = Math.floor(time / 60)
                const seconds = Math.floor(time % 60)
                newTimestamps.push({
                  timestamp: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
                  description: event.description,
                  isDangerous: event.isDangerous
                })
              })
            }
          } catch (error) {
            console.error('Error analyzing frame:', error)
          }
        }
      }

      console.log('Analysis complete, found timestamps:', newTimestamps)
      setTimestamps(newTimestamps)
      setIsAnalyzing(false)
      setUploadProgress(100)
    } catch (error) {
      console.error("Error uploading/analyzing video:", error)
      setIsUploading(false)
      setIsAnalyzing(false)
    }
  }

  const handleTimestampClick = (timestamp: string) => {
    if (!videoRef.current) return

    const [minutes, seconds] = timestamp.split(":").map(Number)
    const timeInSeconds = minutes * 60 + seconds
    videoRef.current.currentTime = timeInSeconds
    videoRef.current.play()
  }

  const handleSaveVideo = () => {
    if (!videoUrl || !videoName) return

    const savedVideos: SavedVideo[] = JSON.parse(localStorage.getItem("savedVideos") || "[]")
    const newVideo: SavedVideo = {
      id: Date.now().toString(),
      name: videoName,
      url: videoUrl,
      thumbnailUrl: videoUrl, 
      timestamps: timestamps,
    }
    savedVideos.push(newVideo)
    localStorage.setItem("savedVideos", JSON.stringify(savedVideos))
    alert("Video saved successfully!")
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start py-8 px-4 sm:px-6">
      <div className="w-full max-w-5xl relative">
        <div className="relative z-10 p-0 sm:p-8">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center px-4">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                Video Timestamp Analyzer
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base">Upload a video to analyze key moments and generate timestamps</p>
            </div>

            {!videoUrl && (
              <div className="flex justify-center px-4">
                <div className="w-full max-w-xl">
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-2xl cursor-pointer border-zinc-700 hover:bg-zinc-800/30 hover:border-purple-500/5 transition-all group backdrop-blur-sm"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.add('border-purple-500', 'bg-purple-500/5');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('border-purple-500', 'bg-purple-500/5');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('border-purple-500', 'bg-purple-500/5');
                      
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith('video/')) {
                        const input = document.getElementById('video-upload') as HTMLInputElement;
                        if (input) {
                          const dataTransfer = new DataTransfer();
                          dataTransfer.items.add(file);
                          input.files = dataTransfer.files;
                          handleFileUpload({ target: { files: dataTransfer.files } } as any);
                        }
                      }
                    }}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <div className="p-4 bg-zinc-800/50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="h-8 w-8 text-zinc-400 group-hover:text-purple-400" />
                      </div>
                      <p className="mb-2 text-base sm:text-lg text-zinc-300">
                        <span className="font-semibold text-white">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-500">MP4, WebM, or OGG up to 50MB</p>
                    </div>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading || isAnalyzing}
                    />
                  </label>
                </div>
              </div>
            )}

            {(isUploading || isAnalyzing) && (
              <div className="max-w-xl mx-auto space-y-4 px-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">{isUploading ? "Uploading video..." : "Analyzing video content..."}</span>
                  <span className="text-purple-400 font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-zinc-800" />
              </div>
            )}

            {videoUrl && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
                      <VideoPlayer url={videoUrl} timestamps={timestamps} ref={videoRef} />
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-900/30 rounded-2xl border border-white/10">
                      <div className="flex-1 min-w-[240px]">
                        <p className="text-xs text-zinc-500 mb-1">Video Title</p>
                        <Input
                          type="text"
                          placeholder="Enter video name"
                          value={videoName}
                          onChange={(e) => setVideoName(e.target.value)}
                          className="bg-black/40 border-white/10 text-white focus:border-purple-500/50 h-10 rounded-xl"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          onClick={handleSaveVideo}
                          className="bg-white text-black hover:bg-zinc-200 rounded-xl px-6 font-semibold"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Video
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-zinc-900/30 p-4 sm:p-6 rounded-2xl border border-white/10 h-full backdrop-blur-sm">
                      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>Event Feed</span>
                        {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin text-purple-400" />}
                      </h2>
                      <TimestampList
                        timestamps={timestamps}
                        onTimestampClick={handleTimestampClick}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center pt-8">
              <Link href="/pages/saved-videos" className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
                View Saved Videos Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
