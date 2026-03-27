import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10">
      <div className="w-[75%] mx-auto py-16 flex flex-row justify-between gap-10">

        {/* Brand */}
        <div className="flex flex-col gap-4 max-w-[280px]">
          <h2 className="text-2xl font-bold">
            Nazar<span className="text-[#206EF6]">AI</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Turn your CCTV into 24/7 intelligent surveillance. No new hardware needed.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-[#F46F6F] animate-pulse"></span>
            <span className="text-[#F46F6F] text-xs font-semibold tracking-wide">LIVE MONITORING</span>
          </div>
        </div>

        {/* Product */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Product</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            <li><Link href="/cameras" className="hover:text-white transition-colors">Live Cameras</Link></li>
            <li><Link href="/alerts" className="hover:text-white transition-colors">Alerts</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
          </ul>
        </div>

        {/* Detections */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Detections</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="text-[#F46F6F]">Theft & Shoplifting</li>
            <li className="text-[#F8E082]">Fire & Smoke</li>
            <li className="text-[#6FF4C6]">Falls</li>
            <li className="text-[#F59E0B]">Fights & Aggression</li>
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Company</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li>
              <Link href="https://cal.com/abhishek-kholiya/30min" target="_blank" className="hover:text-white transition-colors">
                Book a Demo
              </Link>
            </li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Get Started</h3>
          <p className="text-white/50 text-sm">Don't wait for incidents. Prevent them.</p>
          <Link
            href="/signup"
            className="mt-2 px-6 py-3 bg-[#206EF6] rounded-xl text-sm font-semibold text-center hover:bg-[#1a5fd4] transition-colors"
          >
            Sign Up Free
          </Link>
          <Link
            href="https://cal.com/abhishek-kholiya/30min"
            target="_blank"
            className="px-6 py-3 rounded-xl border border-white/20 text-sm font-semibold text-center hover:border-white/60 transition-colors"
          >
            Book Demo
          </Link>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="w-[75%] mx-auto flex flex-row items-center justify-between text-white/30 text-xs">
          <p>© {new Date().getFullYear()} NazarAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}