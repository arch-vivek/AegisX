import { ShieldCheck, Link2, PlayCircle, BookOpen, LifeBuoy, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, useRouter } from "@/lib/router"
import type { RoutedPage } from "@/lib/routes"

const items: { to: RoutedPage; label: string; icon: React.ElementType }[] = [
  { to: "home", label: "Home", icon: ShieldCheck },
  { to: "analyzer", label: "Analyze", icon: Link2 },
  { to: "simulator", label: "Simulator", icon: PlayCircle },
  { to: "learn", label: "Learn", icon: BookOpen },
  { to: "respond", label: "Respond", icon: LifeBuoy },
  { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
]

export function Nav() {
  const { page } = useRouter()
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2">
        <Link to="home" className="flex items-center gap-2 text-lg font-bold text-primary">
          <ShieldCheck className="h-6 w-6 text-accent" aria-hidden="true" />
          <span>AegisX</span>
        </Link>
        <nav aria-label="Primary" className="w-full overflow-x-auto sm:w-auto">
          <ul className="flex min-w-max items-center gap-1">
            {items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={page === to ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold transition-colors",
                    page === to ? "bg-primary text-primary-foreground" : "text-secondary hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
