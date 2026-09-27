import { useState } from "react"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { scenarios } from "@/lib/content"
import { recordScenario } from "@/lib/stats"

export function Simulator() {
  const [index, setIndex] = useState(0)
  const [chosenId, setChosenId] = useState<string | null>(null)
  const scenario = scenarios[index]
  const chosen = scenario.options.find((o) => o.id === chosenId)

  function choose(id: string) {
    if (chosenId) return
    setChosenId(id)
    recordScenario()
  }

  function next() {
    setChosenId(null)
    setIndex((i) => (i + 1) % scenarios.length)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-primary">Scam scenario simulator</h1>
        <p className="mt-1 text-muted-foreground">
          Realistic, fictionalised scam scenarios. Pick how you'd respond, then see why.
        </p>
      </div>

      <p className="text-sm font-bold text-muted-foreground">
        Scenario {index + 1} of {scenarios.length}
      </p>

      <Card>
        <CardHeader>
          <Badge className="mb-2 w-fit">{scenario.channel}</Badge>
          <CardTitle>{scenario.title}</CardTitle>
          <CardDescription className="mt-2 rounded-md bg-muted p-3 text-foreground/90">
            "{scenario.message}"
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-0">
          <p className="font-bold text-sm">What do you do?</p>
          {scenario.options.map((opt) => {
            const isChosen = chosenId === opt.id
            const showState = Boolean(chosenId)
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt.id)}
                disabled={Boolean(chosenId)}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-lg border-2 p-3 text-left text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring
                  ${showState && opt.correct ? "border-success bg-success/10" : ""}
                  ${showState && isChosen && !opt.correct ? "border-destructive bg-destructive/10" : ""}
                  ${!showState ? "border-border bg-card cursor-pointer hover:bg-muted" : "cursor-default"}
                `}
              >
                <span>{opt.label}</span>
                {showState && opt.correct && <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />}
                {showState && isChosen && !opt.correct && <XCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />}
              </button>
            )
          })}

          {chosen && (
            <div role="status" className={`rounded-lg border-2 p-3 text-sm ${chosen.correct ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10"}`}>
              <p className="mb-1 font-bold">{chosen.correct ? "Good call." : "Risky choice."}</p>
              <p>{chosen.feedback}</p>
            </div>
          )}

          {chosen && (
            <Button onClick={next} className="self-start">
              Next scenario <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="self-start"
        onClick={() => {
          setChosenId(null)
          setIndex(0)
        }}
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> Restart
      </Button>
    </div>
  )
}
