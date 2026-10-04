import { Contrast, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { setPrefs, usePrefs, type TextSize, type Theme } from "@/lib/prefs"

const sizes: { value: TextSize; label: string; aria: string }[] = [
  { value: "sm", label: "A-", aria: "Decrease text size" },
  { value: "md", label: "A", aria: "Normal text size" },
  { value: "lg", label: "A+", aria: "Increase text size" },
]

const themes: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "contrast", label: "High contrast", icon: Contrast },
]

const btn =
  "inline-flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-md border-2 px-2.5 text-sm font-bold cursor-pointer transition-colors"

export function A11yToolbar() {
  const prefs = usePrefs()

  function skipToMain(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const main = document.getElementById("main-content")
    main?.focus()
    main?.scrollIntoView()
  }

  return (
    <section aria-label="Accessibility options" className="border-b border-border bg-muted">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2">
        <a href="#main-content" onClick={skipToMain} className="text-sm font-bold underline underline-offset-4">
          Skip to main content
        </a>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div role="group" aria-label="Text size" className="flex items-center gap-1">
            {sizes.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-label={s.aria}
                aria-pressed={prefs.textSize === s.value}
                onClick={() => setPrefs({ ...prefs, textSize: s.value })}
                className={cn(
                  btn,
                  prefs.textSize === s.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-background"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Colour theme" className="flex items-center gap-1">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={prefs.theme === value}
                onClick={() => setPrefs({ ...prefs, theme: value })}
                className={cn(
                  btn,
                  prefs.theme === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-background"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
