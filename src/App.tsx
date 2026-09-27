import { useState } from 'react';
import { Nav, type PageId } from '@/components/Nav';
import { Home } from '@/pages/Home';
import { Analyzer } from '@/pages/Analyzer';
import { Simulator } from '@/pages/Simulator';
import { Learn } from '@/pages/Learn';
import { Respond } from '@/pages/Respond';
import { Dashboard } from '@/pages/Dashboard';

function App() {
  const [page, setPage] = useState<PageId>('home');

  function go(id: PageId) {
    setPage(id);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav active={page} onChange={go} />
      <main id="main-content" tabIndex={-1}>
        {page === 'home' && <Home onNavigate={go} />}
        {page === 'analyzer' && <Analyzer />}
        {page === 'simulator' && <Simulator />}
        {page === 'learn' && <Learn />}
        {page === 'respond' && <Respond />}
        {page === 'dashboard' && <Dashboard />}
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>AegisX — Digital Safety &amp; Cyber Fraud Awareness · </p>
        <p className="mt-1">
          Advisory tool only. In an emergency, contact your bank or the 1930
          cyber-fraud helpline directly.
        </p>
      </footer>
    </div>
  );
}

export default App;
