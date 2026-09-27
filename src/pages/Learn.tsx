import { useState } from "react"
import { CheckCircle2, XCircle, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { quizQuestions } from "@/lib/content"
import { recordQuiz } from "@/lib/stats"

const topics = [
  {
    id: "phishing",
    title: "What is phishing?",
    body: "Phishing is a message or page designed to look like it's from someone you trust — a bank, a delivery company, a government office — in order to trick you into revealing information or clicking a malicious link.",
  },
  {
    id: "social-engineering",
    title: "What is social engineering?",
    body: "Social engineering manipulates emotions — urgency, fear, greed, curiosity — rather than exploiting a technical flaw. A caller creating panic about a \"blocked account\" is using social engineering, not hacking.",
  },
  {
    id: "otp-safety",
    title: "Safe OTP and PIN practices",
    body: "An OTP/PIN is only ever meant for you to enter yourself, into the app or site you trust. No bank, delivery company, or government office will ever ask you to read one aloud or type it into a form they sent you.",
  },
  {
    id: "upi-safety",
    title: "Safe UPI practices",
    body: "You only need to enter your UPI PIN to send money, never to receive it. If a \"collect request\" or payment page asks for your PIN to get a refund or a prize, it is a scam.",
  },
]

export function Learn() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = quizQuestions.filter((q) => answers[q.id] === q.correctIndex).length

  function submit() {
    setSubmitted(true)
    recordQuiz(score)
  }

  function reset() {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-primary">Learn: awareness modules</h1>
        <p className="mt-1 text-muted-foreground">Short, practical explanations — then a quick quiz to check what stuck.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Core concepts</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Accordion type="single" collapsible>
            {topics.map((t) => (
              <AccordionItem key={t.id} value={t.id}>
                <AccordionTrigger>{t.title}</AccordionTrigger>
                <AccordionContent>{t.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Awareness quiz</CardTitle>
          <CardDescription>{quizQuestions.length} questions · answers are only revealed after you submit</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pt-0">
          {quizQuestions.map((q, qi) => (
            <fieldset key={q.id} className="flex flex-col gap-2">
              <legend className="mb-1 font-bold text-sm">
                {qi + 1}. {q.question}
              </legend>
              {q.options.map((opt, oi) => {
                const isSelected = answers[q.id] === oi
                const showCorrectness = submitted
                const isCorrect = oi === q.correctIndex
                return (
                  <label
                    key={oi}
                    className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border-2 p-2 text-sm transition-colors
                      ${showCorrectness && isCorrect ? "border-success bg-success/10" : ""}
                      ${showCorrectness && isSelected && !isCorrect ? "border-destructive bg-destructive/10" : ""}
                      ${!showCorrectness ? "border-border hover:bg-muted" : ""}
                    `}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="h-4 w-4 accent-accent"
                      checked={isSelected}
                      disabled={submitted}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    />
                    {opt}
                    {showCorrectness && isCorrect && <CheckCircle2 className="ml-auto h-4 w-4 text-success" aria-hidden="true" />}
                    {showCorrectness && isSelected && !isCorrect && <XCircle className="ml-auto h-4 w-4 text-destructive" aria-hidden="true" />}
                  </label>
                )
              })}
              {submitted && <p className="text-sm text-muted-foreground">{q.explanation}</p>}
            </fieldset>
          ))}

          {!submitted ? (
            <Button onClick={submit} disabled={Object.keys(answers).length < quizQuestions.length} className="self-start">
              Submit answers
            </Button>
          ) : (
            <div className="rounded-lg border-2 border-accent/40 bg-accent/10 p-4" role="status">
              <p className="mb-2 flex items-center gap-2 font-bold text-accent">
                <Trophy className="h-5 w-5" aria-hidden="true" /> Score: {score} / {quizQuestions.length}
              </p>
              <Progress value={(score / quizQuestions.length) * 100} className="mb-3" />
              <Button variant="outline" onClick={reset}>
                Retake quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
