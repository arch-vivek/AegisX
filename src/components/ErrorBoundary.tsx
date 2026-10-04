import { Component, type ErrorInfo, type ReactNode } from "react"

interface State {
  failed: boolean
}

/** Last line of defence: a rendering bug shows a calm message instead of a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Logged to the browser console only; AegisX sends nothing to any server.
    console.error("AegisX render error:", error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-3">
          The page could not be displayed. Nothing you typed was sent anywhere. If you are dealing
          with a suspected fraud right now, call the cyber-fraud helpline{" "}
          <a className="font-bold underline" href="tel:1930">1930</a> or visit{" "}
          <a className="font-bold underline" href="https://cybercrime.gov.in" rel="noopener noreferrer">
            cybercrime.gov.in
          </a>.
        </p>
        <p className="mt-4">
          <a className="font-bold underline" href="/">Reload AegisX</a>
        </p>
      </main>
    )
  }
}
