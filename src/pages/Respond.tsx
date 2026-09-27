import { PhoneCall, Globe2, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { responsePlaybook } from "@/lib/content"

export function Respond() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-primary">Incident response guidance</h1>
        <p className="mt-1 text-muted-foreground">
          If you've already interacted with a suspected scam, find your situation below and act quickly —
          speed matters most in the first hour.
        </p>
      </div>

      <Alert variant="destructive">
        <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        <div>
          <AlertTitle>In every case: report it</AlertTitle>
          <AlertDescription>
            <p className="mb-2">AegisX guides you here, but only official channels can act on fraud:</p>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 font-bold"><Globe2 className="h-4 w-4" aria-hidden="true" /> cybercrime.gov.in</span>
              <span className="flex items-center gap-1.5 font-bold"><PhoneCall className="h-4 w-4" aria-hidden="true" /> Helpline 1930</span>
            </div>
          </AlertDescription>
        </div>
      </Alert>

      <div className="flex flex-col gap-4">
        {responsePlaybook.map((item) => (
          <Card key={item.situation}>
            <CardHeader>
              <CardTitle className="text-base">{item.situation}</CardTitle>
              <CardDescription>Follow these steps in order.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ol className="list-decimal space-y-2 pl-5 text-sm">
                {item.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
