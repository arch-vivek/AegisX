import { PhoneCall, Globe2, ShieldAlert, RadioTower } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ExternalLink } from "@/components/ExternalLink"
import { responsePlaybook } from "@/lib/content"

export function Respond() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-primary">Incident response guidance</h1>
        <p className="mt-1 text-muted-foreground">
          If you've already interacted with a suspected scam, find your situation below and act quickly.
          Speed matters most in the first hour.
        </p>
      </div>

      <Alert variant="destructive">
        <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        <div>
          <AlertTitle>If you lost money or shared banking details: report it now</AlertTitle>
          <AlertDescription>
            <p className="mb-2">AegisX only guides you. Official channels are the ones that can act on fraud:</p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <ExternalLink href="https://cybercrime.gov.in">National Cyber Crime Reporting Portal (cybercrime.gov.in)</ExternalLink>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  Cyber-fraud helpline{" "}
                  <a className="font-bold underline underline-offset-4" href="tel:1930">1930</a>
                </span>
              </li>
            </ul>
          </AlertDescription>
        </div>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Received a suspicious call, SMS or WhatsApp but lost nothing?</CardTitle>
          <CardDescription>You can still help stop it from reaching others.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 text-sm">
          <p className="flex items-start gap-2">
            <RadioTower className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              The Department of Telecommunications' <strong>Chakshu</strong> facility on the{" "}
              <ExternalLink href="https://sancharsaathi.gov.in">Sanchar Saathi portal</ExternalLink> accepts
              reports of suspected fraud communications. It is not for cases where money has already been lost:
              use the channels above for those.
            </span>
          </p>
        </CardContent>
      </Card>

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
