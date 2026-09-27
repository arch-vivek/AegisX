// Static awareness / simulation content used by the Simulator and Learn modules.

export interface ScenarioOption {
  id: string
  label: string
  correct: boolean
  feedback: string
}

export interface Scenario {
  id: string
  title: string
  channel: string
  message: string
  options: ScenarioOption[]
}

export const scenarios: Scenario[] = [
  {
    id: "kyc-sms",
    title: "Bank KYC update SMS",
    channel: "SMS",
    message:
      "Dear Customer, your bank a/c will be blocked within 24 hours. Update your KYC immediately: hdfc-kyc-update.xyz/verify",
    options: [
      { id: "click", label: "Open the link and complete the KYC form", correct: false, feedback: "The domain is not the bank's official site, and the urgency plus threat of blocking is a classic pressure tactic." },
      { id: "call", label: "Call the number that sent the SMS", correct: false, feedback: "SMS senders can be spoofed; calling back doesn't confirm who you're really talking to." },
      { id: "verify", label: "Open your bank's official app or website directly and check", correct: true, feedback: "Correct. Verifying through a channel you already trust, not the one in the message, is the safe move." },
    ],
  },
  {
    id: "courier-fee",
    title: "Courier \"customs fee\" message",
    channel: "WhatsApp",
    message: "Your parcel is on hold at customs. Pay a small fee of ₹49 here to release it: pay-parcel-release.top",
    options: [
      { id: "pay", label: "Pay the ₹49 fee to release the parcel", correct: false, feedback: "Small \"release fees\" are a common advance-fee pattern designed to feel low-risk." },
      { id: "ignore-verify", label: "Ignore the link and track the parcel via the courier's official site/app", correct: true, feedback: "Correct. Legitimate couriers don't charge random release fees over an SMS link." },
      { id: "share-details", label: "Reply with your address and card details to confirm", correct: false, feedback: "Never send payment details in reply to an unsolicited message." },
    ],
  },
  {
    id: "job-offer",
    title: "Work-from-home job offer",
    channel: "WhatsApp",
    message: "Congratulations! You're selected for a part-time job earning ₹5000/day. Contact HR on Telegram to start today.",
    options: [
      { id: "join", label: "Join the Telegram group and start immediately", correct: false, feedback: "Unrealistic pay for unverified, unsolicited work is a common recruitment-scam hook." },
      { id: "research", label: "Research the company independently before responding", correct: true, feedback: "Correct. A genuine employer can be verified; a scam offer usually can't withstand basic checking." },
      { id: "pay-registration", label: "Pay a small registration fee they ask for", correct: false, feedback: "Legitimate employers do not ask candidates to pay to be hired." },
    ],
  },
  {
    id: "tech-support-otp",
    title: "\"Bank security team\" phone call",
    channel: "Phone call",
    message: "Caller claims to be from your bank's security team and asks you to share the OTP you just received to \"verify your identity\".",
    options: [
      { id: "share-otp", label: "Share the OTP since they already know your account details", correct: false, feedback: "Knowing some details doesn't prove identity — OTPs exist precisely so banks never need to ask for them." },
      { id: "refuse-hangup", label: "Refuse, hang up, and call the bank back using the number on your card", correct: true, feedback: "Correct. No bank employee will ever ask you to read out an OTP." },
      { id: "install-app", label: "Install the screen-sharing app they suggest", correct: false, feedback: "This hands a stranger direct control of your device and banking apps." },
    ],
  },
]

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "A message asks you to share the OTP you just received to \"cancel\" a transaction you never made. What should you do?",
    options: ["Share it quickly to cancel the transaction", "Never share the OTP; contact your bank directly", "Share it only if they know your name"],
    correctIndex: 1,
    explanation: "An OTP is proof of consent for a transaction you initiate — no one else should ever need it.",
  },
  {
    id: "q2",
    question: "Which of these is the strongest red flag in a link?",
    options: ["It uses HTTPS", "It contains a brand name plus a mismatched, hyphenated domain", "It is short"],
    correctIndex: 1,
    explanation: "A brand name paired with a domain that doesn't actually belong to that brand is a strong impersonation signal.",
  },
  {
    id: "q3",
    question: "You realise you just entered your net-banking password on a fake site. What's the first thing to do?",
    options: ["Wait and see if anything happens", "Immediately change your password and contact your bank", "Delete the message and move on"],
    correctIndex: 1,
    explanation: "Acting immediately — changing credentials and alerting your bank — limits the damage.",
  },
  {
    id: "q4",
    question: "A caller says they're from \"cyber cell\" and demands an urgent UPI payment to avoid arrest. This is:",
    options: ["A legitimate emergency procedure", "A digital-arrest style impersonation scam", "Standard police process in India"],
    correctIndex: 1,
    explanation: "Indian law enforcement does not collect fines or payments over a phone call/video call. This is a well-documented scam pattern.",
  },
  {
    id: "q5",
    question: "Where should a suspected cyber-fraud incident be officially reported in India?",
    options: ["Only to the sender of the message", "The National Cyber Crime Reporting Portal (cybercrime.gov.in) or helpline 1930", "It cannot be reported"],
    correctIndex: 1,
    explanation: "cybercrime.gov.in and the 1930 helpline are India's official channels for reporting cyber fraud.",
  },
]

export interface ResponseStep {
  situation: string
  steps: string[]
}

export const responsePlaybook: ResponseStep[] = [
  {
    situation: "You clicked a suspicious link but entered no details",
    steps: [
      "Close the page without entering any information.",
      "Do not download or open anything the page prompted.",
      "Run a security/antivirus scan if you're on a computer.",
      "Watch your accounts for unusual activity over the next few days.",
    ],
  },
  {
    situation: "You shared an OTP, PIN, or password",
    steps: [
      "Immediately change the affected password from a trusted device.",
      "Call your bank's official helpline (from your card/passbook, not the message) to freeze or monitor the account.",
      "Enable/check transaction alerts on your account.",
      "File a report at cybercrime.gov.in or call 1930 as soon as possible — speed matters for fund recovery.",
    ],
  },
  {
    situation: "You made a payment or transfer to a scammer",
    steps: [
      "Call your bank immediately to report the transaction and request a hold/reversal where possible.",
      "Report it on cybercrime.gov.in or call the 1930 cyber-fraud helpline right away — early reporting improves the chance of freezing the funds.",
      "Save all evidence: messages, UPI reference numbers, screenshots.",
      "File a complaint at your local police station if advised by the helpline.",
    ],
  },
  {
    situation: "You installed a remote-access app at someone's request",
    steps: [
      "Uninstall the app and turn off Wi-Fi/mobile data immediately to cut their access.",
      "Change your banking and email passwords from a different, trusted device.",
      "Contact your bank to flag the account for monitoring.",
      "Report the incident at cybercrime.gov.in or call 1930.",
    ],
  },
]
