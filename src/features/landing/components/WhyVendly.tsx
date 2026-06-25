import { CheckCircle2 } from "lucide-react";

export function WhyVendly() {
  const benefits = [
    "Reduce procurement cycles by up to 60%",
    "Eliminate fraudulent vendors with our AI verification",
    "Compare bids with standardized pricing templates",
    "Communicate securely without exposing private emails",
    "Automate RFP scoring and vendor selection",
    "Scale from 1 to 10,000 opportunities effortlessly"
  ];

  return (
    <section className="bg-slate-900 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Why Choose Vendly?</h2>
          <p className="mt-4 text-center text-lg text-slate-300">
            We built Vendly because traditional procurement is broken. Emails get lost, spreadsheets get messy, and finding good vendors is too hard.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-4 rounded-xl bg-slate-800/50 p-6 backdrop-blur-sm">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
              <p className="text-left font-medium text-slate-100">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
