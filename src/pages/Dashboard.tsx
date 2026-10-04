import { useState } from "react"
import { Activity, ShieldCheck, ShieldAlert, ShieldQuestion, Trophy, PlayCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { clearStats, loadStats } from "@/lib/stats"
import { resetPrefs } from "@/lib/prefs"
import { quizQuestions } from "@/lib/content"

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-accent">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState(loadStats)
  const [cleared, setCleared] = useState(false)

  function clearAll() {
    clearStats()
    resetPrefs()
    setStats(loadStats())
    setCleared(true)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-primary">Your safety dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Stored only in this browser. AegisX has no accounts and does not send this data anywhere.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Activity} label="Messages/links analyzed" value={stats.analysesRun} />
        <StatCard icon={PlayCircle} label="Scenarios completed" value={stats.scenariosCompleted} />
        <StatCard icon={Trophy} label="Best quiz score" value={`${stats.quizBestScore}/${quizQuestions.length}`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Results by risk level</CardTitle>
          <CardDescription>A breakdown of everything you've checked in the Analyzer.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-0 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <ShieldCheck className="h-6 w-6 text-success" aria-hidden="true" />
            <div>
              <p className="font-bold">{stats.levelCounts.Low}</p>
              <p className="text-xs text-muted-foreground">Low risk</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <ShieldQuestion className="h-6 w-6 text-warning" aria-hidden="true" />
            <div>
              <p className="font-bold">{stats.levelCounts.Medium}</p>
              <p className="text-xs text-muted-foreground">Medium risk</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <ShieldAlert className="h-6 w-6 text-destructive" aria-hidden="true" />
            <div>
              <p className="font-bold">{stats.levelCounts.High}</p>
              <p className="text-xs text-muted-foreground">High risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your data on this device</CardTitle>
          <CardDescription>
            Counters above plus your text-size and theme choices. Clearing removes them from this browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-0">
          <Button variant="outline" onClick={clearAll} className="self-start">
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Clear saved data
          </Button>
          <p role="status" className="text-sm text-muted-foreground">
            {cleared ? "Saved data cleared." : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
