import { Search, ShieldQuestion, MessageSquareWarning, Send, GraduationCap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { PageId } from "@/components/Nav"

const flow = [
  { icon: ShieldQuestion, title: "RECOGNIZE", text: "Notice a suspicious message, link, call, or payment request." },
  { icon: Search, title: "VERIFY", text: "Run it through AegisX for an explainable, rule-based risk check." },
  { icon: MessageSquareWarning, title: "RESPOND", text: "Follow clear, situation-specific safety guidance." },
  { icon: Send, title: "REPORT", text: "Use official channels — cybercrime.gov.in or helpline 1930." },
  { icon: GraduationCap, title: "LEARN", text: "Build lasting recognition skills through scenarios and quizzes." },
]

export function Home({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
      <section className="text-center">
        <p className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-bold text-accent">
          My Bharat Hackathon · Team AegisX
        </p>
        <h1 className="text-3xl font-bold leading-tight text-primary sm:text-4xl">
          Recognize a scam before it costs you.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          AegisX is a citizen digital-safety companion. Paste a suspicious message or link
          to get an explainable risk assessment, then get clear guidance on what to do next.
          It complements — and never replaces — official cybercrime reporting.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => onNavigate("analyzer")}>
            Analyze something now <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => onNavigate("simulator")}>
            Try a scam scenario
          </Button>
        </div>
      </section>

      <section aria-labelledby="flow-heading">
        <h2 id="flow-heading" className="mb-4 text-center text-xl font-bold text-primary">
          The AegisX flow
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {flow.map(({ icon: Icon, title, text }, i) => (
            <Card key={title} className="text-left">
              <CardHeader>
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">{text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="disclaimer-heading">
        <Card>
          <CardHeader>
            <CardTitle id="disclaimer-heading" className="text-base">What AegisX is — and isn't</CardTitle>
            <CardDescription>Set expectations correctly before you rely on any result.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-0 sm:grid-cols-2">
            <div>
              <p className="mb-1 font-bold text-success">AegisX does</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Flag known scam patterns and structural red flags</li>
                <li>Explain exactly why something looks risky</li>
                <li>Give situation-specific safety guidance</li>
                <li>Point to official reporting channels</li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-bold text-destructive">AegisX does not</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Prove with certainty that something is or isn't fraud</li>
                <li>Replace your bank's or the police's official processes</li>
                <li>Access, store, or need your real account credentials</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
