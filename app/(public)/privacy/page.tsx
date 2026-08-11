import { Reveal, RevealGroup } from "@/components/motion/reveal"
import {
  AlertTriangle,
  CreditCard,
  FileText,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react"

const POLICIES = [
  {
    icon: FileText,
    title: "Terms of Use",
    description:
      "By accessing and using SpotFix, you agree to comply with our platform's rules. SpotFix serves as a bridge connecting customers with independent home service technicians. Users must provide accurate information during booking.",
  },
  {
    icon: Lock,
    title: "Data Privacy",
    description:
      "We collect only the minimal personal data required for booking and account management (Name, Email, Phone, Address). Your data is encrypted and never sold to third-party advertising agencies.",
  },
  {
    icon: UserCheck,
    title: "Technician Responsibilities",
    description:
      "Technicians on SpotFix are verified professionals. However, they operate as independent contractors. SpotFix is not directly liable for disputes, though we maintain strict quality control and review systems.",
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    description:
      "All payments are securely processed via encrypted third-party gateways. SpotFix does not store your credit card information. Refund requests must be submitted within 24 hours of service completion.",
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Activities",
    description:
      "Users must not misuse the platform to harass technicians, create fake bookings, or attempt to bypass the SpotFix payment system. Violations will result in permanent account bans.",
  },
  {
    icon: ShieldCheck,
    title: "Security Measures",
    description:
      "We implement industry-standard JWT authentication and secure database protocols to protect your sessions. You are responsible for keeping your login credentials confidential.",
  },
]

export default function PrivacyTermsPage() {
  return (
    <RevealGroup className="flex min-h-screen flex-col items-center px-6 pt-24 pb-16 sm:px-12">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header Section */}
        <Reveal className="mb-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Privacy & <span className="text-primary">Terms</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Transparency and security are at the core of SpotFix. Please read
            our guidelines carefully to understand your rights and
            responsibilities.
          </p>
        </Reveal>

        {/* Content Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {POLICIES.map((policy, index) => (
            <Reveal
              key={policy.title}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md dark:border-card-foreground/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <policy.icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {policy.title}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {policy.description}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Footer Contact Banner */}
        <Reveal className="mt-16 rounded-2xl border bg-primary/5 p-8 text-center dark:border-primary/10">
          <h3 className="text-xl font-medium">Still have questions?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            If you need further clarification regarding our privacy practices or
            terms of service, feel free to reach out.
          </p>
          <a
            href="mailto:support@spotfix.com"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Contact Support
          </a>
        </Reveal>
      </div>
    </RevealGroup>
  )
}
