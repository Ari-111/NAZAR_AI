import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link"
import ParticleBackground from "@/components/particle-background"
import AnimatedText from "@/components/animated-text"
import Footer from "@/components/footer"

export default async function Home() {
  return (
    <>
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient"></div>
      
      <div className="w-[100%] h-[95svh] flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundImage: "url('/gifs/landing-page.gif')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 text-center">
          <div className="border border-white p-2 rounded-[40px]">
            <h2 className="text-sm sm:text-base px-2">24/7 Suraksha</h2>
          </div>
          <h1 className="mt-6 sm:mt-10 text-4xl sm:text-6xl font-bold">Turn your <span className="text-[#206EF6]">CCTV</span></h1>
          <h1 className="mt-4 sm:mt-8 text-4xl sm:text-6xl font-bold line-height-tight">into 24/7 suraksha guard</h1>

          <div className="mt-8 sm:mt-10 max-w-2xl">
            <p className="text-lg sm:text-xl text-white/80">Detect theft, fire, and risks in real-time. No new hardware needed</p>
          </div>
        </div>
      </div>

      <div id="detection" className="w-[100%] h-auto flex flex-col items-center justify-center px-4 overflow-hidden">
          <div className="mt-12 sm:mt-20 w-full sm:w-[85%] lg:w-[75%] flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-[50%] flex flex-col items-start justify-center">
                    <div className="inline-flex items-center justify-center p-1 px-3 bg-[rgb(0,0,0,0.4)] border border-white rounded-[20px]">
                      <p className="text-[#F46F6F] text-xs sm:text-sm font-bold">REAL-TIME DETECTION</p>
                    </div>
                    <h2 className="w-full mt-5 text-3xl sm:text-5xl font-bold leading-tight">Catches <span className="text-[#F46F6F]">bad actors</span> in real time</h2>
                    <p className="w-full mt-5 text-lg sm:text-xl text-[rgb(255,255,255,0.6)] leading-normal">Nazar detects suspicious behavior & sends instant alert to security teams</p>
                </div>

                <div className="w-full md:w-[50%] flex items-center justify-center p-0 sm:p-4 min-h-[250px] sm:min-h-[300px]">
                  <div className="relative w-full rounded-lg overflow-hidden">
                    <img
                      src="/gifs/theft.gif"
                      alt="Theft detection"
                      className="w-full rounded-xl border-2 border-[rgb(255,255,255,0.4)]"
                    />
                    <div className="absolute top-[75%] sm:top-[85%] right-4 sm:left-[60%] flex items-center gap-2 bg-black/60 border border-[#F46F6F] rounded px-3 py-1.5 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-[#F46F6F] animate-pulse"></span>
                      <span className="text-[#F46F6F] text-xs sm:text-sm font-semibold tracking-wide">⚠ THEFT DETECTED</span>
                    </div>
                  </div>
                </div>
          </div>

          <div className="mt-20 w-full sm:w-[85%] lg:w-[75%] flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="w-full md:w-[50%] flex flex-col items-start md:items-end justify-center">
                    <div className="w-full md:w-[85%] flex md:justify-end">
                      <div className="inline-flex items-center justify-center p-1 px-4 bg-[rgb(0,0,0,0.4)] border border-white rounded-[20px]">
                        <p className="text-[#F8E082] text-xs sm:text-sm font-bold">DISASTER PREVENTION</p>
                      </div>
                    </div>
                    <h2 className="w-full md:w-[85%] md:text-right mt-5 text-3xl sm:text-5xl font-bold leading-tight">Detects <span className="text-[#F8E082]">fire hazards</span> instantly</h2>
                    <p className="w-full md:w-[85%] md:text-right mt-5 text-lg sm:text-xl text-[rgb(255,255,255,0.6)] leading-normal">Nazar detects smoke and fire in real time & alerts your team and fire department immediately</p>
                </div>

                <div className="w-full md:w-[50%] flex items-center justify-center p-0 sm:p-4 min-h-[250px] sm:min-h-[300px]">
                  <div className="relative w-full rounded-lg overflow-hidden">
                    <img
                      src="/gifs/fire.gif"
                      alt="Fire detection"
                      className="w-full rounded-xl border-2 border-[rgb(255,255,255,0.4)]"
                    />
                    <div className="absolute top-[75%] sm:top-[85%] right-4 sm:left-[60%] flex items-center gap-2 bg-black/60 border border-[#F8E082] rounded px-3 py-1.5 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-[#F8E082] animate-pulse"></span>
                      <span className="text-[#F8E082] text-xs sm:text-sm font-semibold tracking-wide">⚠ FIRE DETECTED</span>
                    </div>
                  </div>
                </div>
          </div>

           <div className="mt-20 w-full sm:w-[85%] lg:w-[75%] flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-[50%] flex flex-col items-start justify-center">
                    <div className="inline-flex items-center justify-center p-1 px-3 bg-[rgb(0,0,0,0.4)] border border-white rounded-[20px]">
                      <p className="text-[#6FF4C6] text-xs sm:text-sm font-bold">SAFETY AWARE</p>
                    </div>
                    <h2 className="w-full mt-5 text-3xl sm:text-5xl font-bold leading-tight">Detects <span className="text-[#6FF4C6]">falls</span> instantly</h2>
                    <p className="w-full mt-5 text-lg sm:text-xl text-[rgb(255,255,255,0.6)] leading-normal">Nazar detects falls in real time & alerts your team immediately for quick response</p>
                </div>

                <div className="w-full md:w-[50%] flex items-center justify-center p-0 sm:p-4 min-h-[250px] sm:min-h-[300px]">
                  <div className="relative w-full rounded-lg overflow-hidden">
                    <img
                      src="/gifs/fall.gif"
                      alt="Theft detection"
                      className="w-full rounded-xl border-2 border-[rgb(255,255,255,0.4)]"
                    />
                    <div className="absolute top-[75%] sm:top-[85%] right-4 sm:left-[60%] flex items-center gap-2 bg-black/60 border border-[#6FF4C6] rounded px-3 py-1.5 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-[#6FF4C6] animate-pulse"></span>
                      <span className="text-[#6FF4C6] text-xs sm:text-sm font-semibold tracking-wide">⚠ FALL DETECTED</span>
                    </div>
                  </div>
                </div>
          </div>

           <div className="mt-20 w-full sm:w-[85%] lg:w-[75%] flex flex-col md:flex-row-reverse mb-20 gap-8 items-center">
                <div className="w-full md:w-[50%] flex flex-col items-start md:items-end justify-center">
                    <div className="w-full md:w-[85%] flex md:justify-end">
                      <div className="inline-flex items-center justify-center p-1 px-4 bg-[rgb(0,0,0,0.4)] border border-white rounded-[20px]">
                        <p className="text-[#F59E0B] text-xs sm:text-sm font-bold">AGGRESSION ALERT</p>
                      </div>
                    </div>
                    <h2 className="w-full md:w-[85%] md:text-right mt-5 text-3xl sm:text-5xl font-bold leading-tight">Detects <span className="text-[#F59E0B]">fights</span> instantly</h2>
                    <p className="w-full md:w-[85%] md:text-right mt-5 text-lg sm:text-xl text-[rgb(255,255,255,0.6)] leading-normal">Nazar detects physical altercations in real time & alerts your team immediately to take action</p>
                </div>

                <div className="w-full md:w-[50%] flex items-center justify-center p-0 sm:p-4 min-h-[250px] sm:min-h-[300px]">
                  <div className="relative w-full rounded-lg overflow-hidden">
                    <img
                      src="/gifs/fight.gif"
                      alt="Fire detection"
                      className="w-full rounded-xl border-2 border-[rgb(255,255,255,0.4)]"
                    />
                    <div className="absolute top-[75%] sm:top-[85%] right-4 sm:left-[60%] flex items-center gap-2 bg-black/60 border border-[#F59E0B] rounded px-3 py-1.5 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
                      <span className="text-[#F59E0B] text-xs sm:text-sm font-semibold tracking-wide">⚠ FIGHT DETECTED</span>
                    </div>
                  </div>
                </div>
          </div>
      </div>

      <div id="cta" className="w-[100%] py-20 px-4 flex flex-col items-center justify-center text-center">
                  <h1 className="text-4xl sm:text-6xl font-bold">Don't wait for incidients to happen.</h1>
                  <h1 className="mt-4 sm:mt-8 text-4xl sm:text-6xl font-bold">Prevent Them!</h1>

                  <div className="w-auto mt-12 sm:mt-20 flex flex-col sm:flex-row gap-4 sm:gap-10">
                      <Link href={'/sign-up'} className="p-4 px-10 bg-[#206EF6] rounded-2xl cursor-pointer hover:bg-[#1a5bc9] transition-colors">
                        <h2 className="text-lg font-semibold">Sign Up</h2>
                      </Link>

                      <Link href={'https://cal.com/airxashish/30min'} target="on_blank" className="p-4 px-10 rounded-2xl border border-white cursor-pointer hover:bg-white/10 transition-colors">
                        <h2 className="text-lg font-semibold">Book Demo</h2>
                      </Link>
                  </div>
      </div>  
        {/* <ParticleBackground /> */}
        <div className="z-10 text-center space-y-4">
          {/* <h1 className="text-6xl font-bold mb-2 text-white glow-text">Nazar-AI</h1>
          <AnimatedText />
          <Link
            href="/sign-in"
            className="inline-block px-8 py-3 mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-xl font-semibold transition-all duration-300 ease-in-out hover:from-purple-500 hover:to-blue-500 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-purple-500/25"
          >
            Get Started
          </Link> */}

        </div>
    </main>
    <Footer />
    </>
  )
}