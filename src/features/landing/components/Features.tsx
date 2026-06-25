import { Building2, Globe, ShieldCheck, Zap, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const features = [
  {
    title: "Centralized Procurement",
    description: "Manage all your opportunities, vendor applications, and project awards from a single, unified dashboard.",
    icon: Building2,
  },
  {
    title: "Global Discovery",
    description: "Access a worldwide network of pre-vetted vendors matching your exact industry requirements.",
    icon: Globe,
  },
  {
    title: "Secure Verification",
    description: "Multi-tier verification processes ensure you're working with legitimate, high-quality businesses.",
    icon: ShieldCheck,
  },
  {
    title: "Lightning Fast Matching",
    description: "Our intelligent matching algorithm automatically connects the best vendors to your open opportunities.",
    icon: Zap,
  },
  {
    title: "Collaborative Tools",
    description: "Built-in query management and messaging systems keep communication transparent and organized.",
    icon: Users,
  },
  {
    title: "Real-time Analytics",
    description: "Track project costs, vendor performance, and application metrics through comprehensive dashboards.",
    icon: BarChart3,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">Features</h2>
          <p className="mt-2 text-center text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            Everything you need to manage vendors
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-500 dark:text-slate-400">
            Vendly is built from the ground up to streamline the B2B procurement lifecycle for modern businesses.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="group transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:border-slate-700">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-slate-800 dark:text-primary-400 dark:group-hover:bg-primary-600 dark:group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
