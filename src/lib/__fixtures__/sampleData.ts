// Sample/test data for the AegisX risk engine.
// Each case is a realistic (fictionalised) message or URL with the risk level
// a correctly-working engine is expected to assign. Used by riskEngine.test.ts
// and documented in docs/SAMPLE_DATA.md.

export interface SampleCase {
  id: string
  label: string
  input: string
  expectedLevel: "Low" | "Medium" | "High"
  note: string
}

export const sampleCases: SampleCase[] = [
  {
    id: "s1",
    label: "Fake bank KYC update SMS",
    input: "Dear Customer, your bank a/c will be blocked within 24 hours. Update your KYC immediately: hdfc-kyc-update.xyz/verify",
    expectedLevel: "High",
    note: "Brand name + mismatched hyphenated domain, risky TLD, urgency language, generic greeting.",
  },
  {
    id: "s2",
    label: "OTP-sharing request",
    input: "This is your bank's security team. Please share the OTP you just received to verify your identity and avoid account suspension.",
    expectedLevel: "High",
    note: "Direct OTP request plus urgency/authority impersonation — no bank ever needs your OTP.",
  },
  {
    id: "s3",
    label: "Courier customs-fee scam link",
    input: "Your parcel is on hold at customs. Pay a small fee of Rs 49 here to release it: pay-parcel-release.top",
    expectedLevel: "High",
    note: "Advance-fee hook combined with a risky TLD.",
  },
  {
    id: "s4",
    label: "Lottery / prize win message",
    input: "Congratulations! You have won a lucky draw prize of Rs 50000. Claim your prize now by paying a processing fee.",
    expectedLevel: "High",
    note: "Unsolicited prize plus a fee to release it — classic advance-fee pattern.",
  },
  {
    id: "s5",
    label: "Shortened link with no other context",
    input: "Check this out: https://bit.ly/3xample",
    expectedLevel: "Medium",
    note: "A single moderate signal (URL shortener) with nothing else suspicious in context.",
  },
  {
    id: "s6",
    label: "Plain HTTP (no TLS) link",
    input: "http://example-shop.com/summer-sale",
    expectedLevel: "Low",
    note: "One low-severity signal (no HTTPS) is below the Medium threshold on its own.",
  },
  {
    id: "s7",
    label: "Ordinary personal message",
    input: "Hi, are we still meeting at 6pm for coffee tomorrow?",
    expectedLevel: "Low",
    note: "No indicators should match; used as a negative/control case.",
  },
  {
    id: "s8",
    label: "Legitimate-looking official URL",
    input: "https://www.uidai.gov.in/",
    expectedLevel: "Low",
    note: "HTTPS, official-looking domain, no obfuscation — negative control for the URL path.",
  },
  {
    id: "s9",
    label: "IP-address link",
    input: "Login here to continue: http://192.168.45.12/login",
    expectedLevel: "High",
    note: "A raw numeric-IP link is treated as high-severity on its own — legitimate consumer services essentially never link straight to an IP address.",
  },
]
