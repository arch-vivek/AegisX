import type { ComponentProps } from "react"
import { ExternalLink as ExternalLinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Links to another site: opens in a new tab, never leaks the referrer, announces itself. */
export function ExternalLink({ className, children, ...props }: Omit<ComponentProps<"a">, "target" | "rel">) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-1 font-bold text-accent underline underline-offset-4", className)}
      {...props}
    >
      {children}
      <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
