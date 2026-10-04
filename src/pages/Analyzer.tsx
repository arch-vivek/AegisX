import { useId, useState } from "react"
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { analyze, MAX_INPUT_CHARS, type AnalysisResult, type Severity } from "@/lib/riskEngine"
import { recordAnalysis } from "@/lib/stats"

const SEVERITY_LABEL: Record<Severity, string> = { low: "Minor signal", medium: "Moderate signal", high: "Strong signal" }
const SEVERITY_VARIANT: Record<Severity, "warning" | "destructive" | "default"> = {
  low: "default",
  medium: "warning",
  high: "destructive",
}

const EXAMPLES = [
  "Dear Customer, your bank a/c will be blocked within 24 hours. Update your KYC immediately: hdfc-kyc-update.xyz/verify",
  "Hi, are we still meeting at 6pm for coffee?",
]

function LevelBanner({ result }: { result: AnalysisResult }) {
  const config = {
    High: { icon: ShieldAlert, variant: "destructive" as const, text: "High risk: treat this as likely fraudulent" },
    Medium: { icon: ShieldQuestion, variant: "warning" as const, text: "Medium risk: verify before acting" },
    Low: { icon: ShieldCheck, variant: "default" as const, text: "Low risk: no strong red flags found" },
  }[result.level]
  const Icon = config.icon
  return (
    <Alert variant={config.variant} role="group">
      <Icon className="h-5 w-5" aria-hidden="true" />
      <div>
        <AlertTitle>{config.text}</AlertTitle>
        <AlertDescription>
          Advisory risk score: {result.score}/100. This is a heuristic assessment, not proof.
        </AlertDescription>
      </div>
    </Alert>
  )
}

export function Analyzer() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const helpId = useId()

  function run(text: string) {
    if (!text.trim()) return
    const r = analyze(text)
    setResult(r)
    recordAnalysis(r.level)
  }

  function clearAll() {
    setInput("")
    setResult(null)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-primary">Analyze a message or link</h1>
        <p className="mt-1 text-muted-foreground">
          Paste the suspicious SMS, WhatsApp message, email text, or URL exactly as you received it.
          Analysis runs in your browser: what you paste is not sent anywhere and is not saved.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 pt-6">
          <label htmlFor="analyzer-input" className="text-sm font-bold">
            Message or link
          </label>
          <Textarea
            id="analyzer-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_INPUT_CHARS}
            aria-describedby={helpId}
            autoComplete="off"
            spellCheck={false}
            placeholder="Paste a message or link here…"
            rows={5}
          />
          <p id={helpId} className="text-xs text-muted-foreground">
            {input.length} / {MAX_INPUT_CHARS} characters. Do not paste OTPs, passwords or card numbers.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => run(input)} disabled={!input.trim()}>
              Check this
            </Button>
            <Button variant="outline" onClick={clearAll} disabled={!input && !result}>
              Clear
            </Button>
            <span className="text-sm text-muted-foreground">or try an example:</span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                className="min-h-11 cursor-pointer rounded px-1 text-sm font-bold text-accent underline underline-offset-4"
                onClick={() => {
                  setInput(ex)
                  run(ex)
                }}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div aria-live="polite" className="sr-only">
        {result ? `Result: ${result.level} risk, score ${result.score} out of 100, ${result.indicators.length} signals found.` : ""}
      </div>

      {result && (
        <div className="flex flex-col gap-4">
          <LevelBanner result={result} />
          {result.truncated && (
            <p className="text-sm text-muted-foreground">
              Only the first {MAX_INPUT_CHARS} characters were analysed.
            </p>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk meter</CardTitle>
              <CardDescription>Higher fill means more matched red-flag signals. It is always shown with a text level, never colour alone.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Progress
                value={result.score}
                aria-label={`Risk score ${result.score} out of 100, ${result.level}`}
                indicatorClassName={result.level === "High" ? "bg-destructive" : result.level === "Medium" ? "bg-warning" : "bg-success"}
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>0 (Low)</span>
                <span>50 (Medium)</span>
                <span>100 (High)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Why this result: {result.indicators.length} signal(s) found</CardTitle>
              <CardDescription>Every AegisX result is explainable: these are the exact patterns matched.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              {result.indicators.length === 0 ? (
                <p className="text-sm text-muted-foreground">No rule-based indicators matched this input.</p>
              ) : (
                result.indicators.map((ind) => (
                  <div key={ind.id} className="rounded-lg border border-border p-3">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold">{ind.label}</span>
                      <Badge variant={SEVERITY_VARIANT[ind.severity]}>{SEVERITY_LABEL[ind.severity]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{ind.detail}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What to do now</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {result.guidance.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
