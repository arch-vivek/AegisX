import { PolicyLayout, PolicySection } from "@/components/PolicyLayout"
import { ExternalLink } from "@/components/ExternalLink"
import { Link } from "@/lib/router"
import { PATHS, TITLES, type RoutedPage } from "@/lib/routes"
import { SITE } from "@/config/site"

const ul = "list-disc space-y-1 pl-5"

export function Privacy() {
  return (
    <PolicyLayout title="Privacy Policy">
      <PolicySection heading="In short">
        <p>
          AegisX is built to work without collecting personal data. What you paste into the Analyzer is
          checked inside your own browser and is neither sent to a server nor saved.
        </p>
      </PolicySection>
      <PolicySection heading="What happens to text and links you paste">
        <p>
          The analysis runs entirely on your device. The text exists only in the page's memory and disappears
          when you press Clear, leave the page or reload it. Please do not paste OTPs, passwords, card
          numbers or Aadhaar details: the checks do not need them.
        </p>
      </PolicySection>
      <PolicySection heading="What is stored on your device">
        <ul className={ul}>
          <li>Your display choices: text size and colour theme.</li>
          <li>
            Simple counters for your Dashboard: number of checks, results by risk level, scenarios completed
            and best quiz score. These never contain message content, links or identifiers.
          </li>
        </ul>
        <p>
          These are kept in your browser's local storage (not cookies) and are never transmitted. You can
          remove them at any time with "Clear saved data" on the Dashboard or through your browser settings.
        </p>
      </PolicySection>
      <PolicySection heading="Cookies, analytics and third parties">
        <p>
          AegisX does not set cookies and contains no analytics, advertising or tracking scripts. The font is
          served from the same site, so your browser makes no request to third-party font providers.
        </p>
      </PolicySection>
      <PolicySection heading="Hosting">
        <p>
          Like any website, AegisX is delivered by a hosting provider, which may process technical request
          data such as IP address and browser type to serve pages and defend against abuse, under its own
          policies. AegisX does not use that data to identify or profile visitors.
        </p>
      </PolicySection>
      <PolicySection heading="Links to other websites">
        <p>
          AegisX links to official portals such as cybercrime.gov.in and sancharsaathi.gov.in. Those sites have
          their own privacy practices, which apply once you leave AegisX.
        </p>
      </PolicySection>
      <PolicySection heading="Your rights and questions">
        <p>
          Because AegisX does not collect digital personal data through the app, there is nothing held about
          you on our side to access, correct or erase. For any privacy question, see the{" "}
          <Link to="contact" className="font-bold underline underline-offset-4">Contact &amp; Feedback</Link> page.
        </p>
        <p>
          If a future version adds accounts or any collection of personal data, this policy will be updated
          first and the change will be dated at the top of this page.
        </p>
      </PolicySection>
    </PolicyLayout>
  )
}

export function Terms() {
  return (
    <PolicyLayout title="Terms of Use">
      <PolicySection heading="Purpose">
        <p>
          AegisX is an awareness and advisory tool that helps you spot common signs of cyber fraud and
          decide what to do next.
        </p>
      </PolicySection>
      <PolicySection heading="Results are advisory, not proof">
        <ul className={ul}>
          <li>A "Low" result does not mean a message or link is safe.</li>
          <li>A "High" result does not prove that fraud is taking place.</li>
          <li>Scammers change their wording constantly; the checks can miss new patterns and can raise false alarms.</li>
        </ul>
        <p>Use your own judgement and confirm anything important through the organisation's official channel.</p>
      </PolicySection>
      <PolicySection heading="Not a substitute for official channels">
        <p>
          AegisX does not investigate, register or resolve complaints. To report fraud or cybercrime, use
          cybercrime.gov.in or call 1930. In an emergency, contact your bank directly.
        </p>
      </PolicySection>
      <PolicySection heading="Independent project">
        <p>
          AegisX is made by {SITE.owner} for the My Bharat Hackathon. It is not a government service and
          is not affiliated with or endorsed by any government body, bank or payment provider.
        </p>
      </PolicySection>
      <PolicySection heading="Acceptable use">
        <p>
          Please do not attempt to disrupt the site, probe it for weaknesses without permission, or present
          it as an official service. Security researchers: see the disclosure guidance on the Contact page.
        </p>
      </PolicySection>
      <PolicySection heading="Warranty and liability">
        <p>
          AegisX is provided "as is", without warranties of any kind. To the extent the law allows, the
          makers are not liable for losses arising from use of, or reliance on, the site.
        </p>
      </PolicySection>
      <PolicySection heading="Changes">
        <p>These terms may change. The date at the top of this page shows when they were last updated.</p>
      </PolicySection>
    </PolicyLayout>
  )
}

export function AccessibilityStatement() {
  return (
    <PolicyLayout title="Accessibility Statement">
      <PolicySection heading="Our aim">
        <p>
          AegisX aims to meet WCAG 2.1 Level AA, the accessibility standard referenced by the Guidelines
          for Indian Government Websites and Apps (GIGW 3.0), so that everyone can use it, including people
          who use screen readers, keyboards, magnification or high-contrast displays.
        </p>
      </PolicySection>
      <PolicySection heading="What is in place">
        <ul className={ul}>
          <li>A "Skip to main content" link and a logical keyboard order, with a visible focus outline.</li>
          <li>Text-size controls (A-, A, A+) and three colour themes, including high contrast.</li>
          <li>Each page has its own title, and focus moves to the page heading after you navigate.</li>
          <li>Risk levels are always written in words, never shown by colour alone.</li>
          <li>Semantic headings, landmarks and labelled form fields; large touch targets on main controls.</li>
          <li>Reduced-motion preferences are respected; the layout reflows on small screens.</li>
          <li>A highly legible typeface (Atkinson Hyperlegible), served from this site.</li>
        </ul>
      </PolicySection>
      <PolicySection heading="How it is tested">
        <p>
          Every page is checked with the axe-core automated accessibility engine in each colour theme, with
          scripted keyboard and small-screen checks. Automated tools find only part of the possible problems.
          Testing with screen readers such as NVDA, JAWS, TalkBack and VoiceOver has not yet been carried
          out, and we have not obtained an independent accessibility audit or certification.
        </p>
      </PolicySection>
      <PolicySection heading="Known limitations">
        <ul className={ul}>
          <li>AegisX is currently available in English only; Hindi and other Indian languages are planned.</li>
          <li>The risk checks look for patterns in English and romanised text.</li>
        </ul>
      </PolicySection>
      <PolicySection heading="Tell us about a barrier">
        <p>
          If something is hard to use, please tell us through the{" "}
          <Link to="contact" className="font-bold underline underline-offset-4">Contact &amp; Feedback</Link> page.
        </p>
      </PolicySection>
    </PolicyLayout>
  )
}

export function Disclaimer() {
  return (
    <PolicyLayout title="Disclaimer, Copyright and Hyperlinking Policy">
      <PolicySection heading="Not an official website">
        <p>
          AegisX is an independent awareness project. It does not use the State Emblem of India or any
          government logo, and nothing on it is official government advice.
        </p>
      </PolicySection>
      <PolicySection heading="Accuracy of content">
        <p>
          Guidance is general and is reviewed when the site is updated. Reporting portals, helpline numbers and
          procedures can change, so confirm current details with the official sources linked from the{" "}
          <Link to="respond" className="font-bold underline underline-offset-4">Respond</Link> page.
        </p>
      </PolicySection>
      <PolicySection heading="Copyright">
        <p>
          Text and design are © {SITE.owner}. The source code is released under the MIT licence. You may
          share links to this site freely. If you reuse the wording, please credit AegisX and do not present
          it as official or government-issued advice.
        </p>
      </PolicySection>
      <PolicySection heading="Linking to other websites">
        <p>
          We link to official and other external sites for your convenience. Linking is not an endorsement,
          and we are not responsible for the content or availability of external sites. External links open in
          a new tab and are marked as such.
        </p>
      </PolicySection>
      <PolicySection heading="Linking to AegisX">
        <p>
          You are welcome to link to any page without asking permission. Please do not frame the site or
          suggest an affiliation that does not exist.
        </p>
      </PolicySection>
    </PolicyLayout>
  )
}

export function Contact() {
  return (
    <PolicyLayout title="Contact and Feedback">
      <PolicySection heading="Reach the AegisX team">
        {SITE.contactEmail ? (
          <p>
            Email <a className="font-bold underline underline-offset-4" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>{" "}
            to report a wrong result, a false alarm, an accessibility barrier, or a security issue.
          </p>
        ) : (
          <p>A contact address has not been configured for this deployment.</p>
        )}
        <p>
          Please never include OTPs, passwords, card numbers or Aadhaar details in a message to us. We cannot
          recover money or investigate fraud.
        </p>
      </PolicySection>
      <PolicySection heading="Report fraud or a security incident">
        <ul className={ul}>
          <li>
            Lost money or targeted by cybercrime:{" "}
            <ExternalLink href="https://cybercrime.gov.in">cybercrime.gov.in</ExternalLink> or call{" "}
            <a className="font-bold underline underline-offset-4" href="tel:1930">1930</a>.
          </li>
          <li>
            Suspicious call, SMS or WhatsApp, no money lost:{" "}
            <ExternalLink href="https://sancharsaathi.gov.in">Sanchar Saathi (Chakshu)</ExternalLink>.
          </li>
        </ul>
      </PolicySection>
      <PolicySection heading="Responsible disclosure">
        <p>
          If you find a security weakness in AegisX, please report it privately using the address above
          before making it public, and give us reasonable time to fix it. Please do not access other people's
          data or disrupt the service while testing.
        </p>
      </PolicySection>
    </PolicyLayout>
  )
}

export function Sitemap() {
  const entries = (Object.keys(PATHS) as RoutedPage[]).map((k) => ({ key: k, title: TITLES[k].replace(" | AegisX", "") }))
  return (
    <PolicyLayout title="Sitemap">
      <ul className="flex flex-col gap-2">
        {entries.map((e) => (
          <li key={e.key}>
            <Link to={e.key} className="inline-block min-h-6 font-bold underline underline-offset-4">
              {e.title}
            </Link>
          </li>
        ))}
      </ul>
    </PolicyLayout>
  )
}

export function NotFound() {
  return (
    <PolicyLayout title="Page not found">
      <p>The page you asked for does not exist on AegisX.</p>
      <p>
        Go to the{" "}
        <Link to="home" className="font-bold underline underline-offset-4">home page</Link> or browse the{" "}
        <Link to="sitemap" className="font-bold underline underline-offset-4">sitemap</Link>.
      </p>
    </PolicyLayout>
  )
}
