import Link from "next/link"
import { Video, PlaySquare, FolderOpen, BarChart2 } from "lucide-react"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/server"

export async function HeaderNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <Link href="/pages/upload" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden lg:inline">Upload</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <Link href="/pages/realtimeStreamPage" className="flex items-center gap-2">
            <PlaySquare className="h-4 w-4" />
            <span className="hidden lg:inline">Realtime</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <Link href="/pages/saved-videos" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            <span className="hidden lg:inline">Library</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <Link href="/pages/statistics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden lg:inline">Statistics</span>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <Link href="/#detection">
          <span>Detection</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" size="sm" className="hidden md:flex text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <Link href="https://cal.com/airxashish/30min" target="_blank">
          <span>Book Demo</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <Link href="/#cta">
          <span>Get Started</span>
        </Link>
      </Button>
    </div>
  )
}
