import { ShieldCheck, Link2, PlayCircle, BookOpen, LifeBuoy, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

export type PageId = "home" | "analyzer" | "simulator" | "learn" | "respond" | "dashboard"

const items: { id: PageId; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: ShieldCheck },
  { id: "analyzer", label: "Analyze", icon: Link2 },
  { id: "simulator", label: "Simulator", icon: PlayCircle },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "respond", label: "Respond", icon: LifeBuoy },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
]

export function Nav({ active, onChange }: { active: PageId; onChange: (id: PageId) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          <ShieldCheck className="h-6 w-6 text-accent" aria-hidden="true" />
          <span>AegisX</span>
        </div>
        <nav aria-label="Primary" className="w-full overflow-x-auto sm:w-auto">
          <ul className="flex min-w-max items-center gap-1">
            {items.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  aria-current={active === id ? "page" : undefined}
                  onClick={() => onChange(id)}
                  className={cn(
                    "flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
                    active === id
                      ? "bg-primary text-primary-foreground"
                      : "text-secondary hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
