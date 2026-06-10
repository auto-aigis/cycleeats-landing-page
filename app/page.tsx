"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Leaf,
  Brain,
  ShieldCheck,
  Zap,
  ArrowRight,
  Check,
  Menu,
  X,
  Heart,
  Utensils,
  ScanSearch,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

interface Step {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <Brain className="h-6 w-6 text-emerald-600" />,
      title: "AI-Powered Meal Plans",
      description:
        "Describe your symptoms, food sensitivities, and hormone phase. Get a personalized weekly meal plan generated in seconds.",
    },
    {
      icon: <ScanSearch className="h-6 w-6 text-emerald-600" />,
      title: "NLP Ingredient Scanner",
      description:
        "Our AI scans ingredients and flags hidden insulin spikes — added sugars, refined starches, and high-GI foods that generic apps miss.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      title: "PCOS-Safe Lens",
      description:
        "Every recipe is filtered through anti-inflammatory, low-glycemic criteria with plain-language explanations of why each food helps or hurts.",
    },
    {
      icon: <Leaf className="h-6 w-6 text-emerald-600" />,
      title: "Anti-Inflammatory Focus",
      description:
        "Recipes prioritize omega-3s, fiber-rich foods, and hormone-balancing nutrients that research shows benefit women with PCOS.",
    },
    {
      icon: <CalendarDays className="h-6 w-6 text-emerald-600" />,
      title: "Cycle-Phase Aware",
      description:
        "Meal plans adapt to your menstrual cycle phase — follicular, ovulatory, luteal, and menstrual — for optimal hormone support.",
    },
    {
      icon: <Zap className="h-6 w-6 text-emerald-600" />,
      title: "Instant Explanations",
      description:
        "No more Googling. Get clear, science-backed reasons for every food recommendation directly in the app.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      icon: <Heart className="h-8 w-8 text-emerald-600" />,
      title: "Tell Us About You",
      description:
        "Share your PCOS symptoms, food sensitivities, dietary preferences, and current cycle phase. It takes less than 2 minutes.",
    },
    {
      number: "02",
      icon: <Brain className="h-8 w-8 text-emerald-600" />,
      title: "AI Generates Your Plan",
      description:
        "Our AI creates a personalized weekly meal plan with low-GI, anti-inflammatory recipes tailored to your unique profile.",
    },
    {
      number: "03",
      icon: <Utensils className="h-8 w-8 text-emerald-600" />,
      title: "Cook, Eat, Thrive",
      description:
        "Follow your plan with grocery lists, prep guides, and swap suggestions. See why each meal supports your PCOS management.",
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Try CycleEats with limited features",
      features: [
        "3 AI-generated meal plans per month",
        "Basic ingredient scanning",
        "Community recipes",
        "Cycle phase tracking",
      ],
      highlighted: false,
      cta: "Get Started Free",
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      description: "Full PCOS meal planning power",
      features: [
        "Unlimited AI meal plans",
        "Advanced NLP ingredient scanner",
        "Full PCOS food explanations",
        "Grocery list generation",
        "Cycle-phase optimization",
        "Swap suggestions",
        "Priority support",
      ],
      highlighted: true,
      cta: "Start Pro Plan",
    },
    {
      name: "Annual",
      price: "$8",
      period: "per month, billed yearly",
      description: "Best value for long-term management",
      features: [
        "Everything in Pro",
        "Save 33% vs monthly",
        "Early access to new features",
        "Dietitian-reviewed recipes",
        "Export meal plans as PDF",
        "Custom recipe uploads",
        "1-on-1 onboarding call",
      ],
      highlighted: false,
      cta: "Start Annual Plan",
    },
  ];

  const faqs: FaqItem[] = [
    {
      question: "How is CycleEats different from MyFitnessPal or other trackers?",
      answer:
        "Generic trackers have zero awareness of PCOS. They cannot identify hidden insulin spikes in composite foods, do not account for hormonal phases, and offer no explanations for why specific foods impact your condition. CycleEats is built from the ground up exclusively for women with PCOS.",
    },
    {
      question: "Do I need a PCOS diagnosis to use CycleEats?",
      answer:
        "While CycleEats is designed for women with PCOS, anyone following an anti-inflammatory, low-glycemic diet can benefit. If you suspect you have PCOS, we always recommend consulting a healthcare provider for proper diagnosis.",
    },
    {
      question: "How does the ingredient scanner work?",
      answer:
        "Our NLP-powered scanner analyzes ingredient lists and nutrition labels to identify hidden sugars, refined starches, and high-GI ingredients that could trigger insulin spikes. It goes beyond simple calorie counting to flag PCOS-specific concerns.",
    },
    {
      question: "Can I customize meal plans for food allergies?",
      answer:
        "Absolutely. During onboarding you can specify any food allergies, intolerances, or dietary preferences (vegan, dairy-free, gluten-free, etc.) and all generated meal plans will respect those constraints.",
    },
    {
      question: "Is my health data private and secure?",
      answer:
        "Yes. We take data privacy seriously. Your health information is encrypted, never shared with third parties, and you can delete your account and all associated data at any time.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Leaf className="h-7 w-7 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">CycleEats</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
              <Separator orientation="vertical" className="h-6" />
              <a href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 py-2">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 py-2">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 py-2">
                FAQ
              </a>
              <Separator />
              <a href="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 text-emerald-700 bg-emerald-50 border-emerald-200">
            Built exclusively for women with PCOS
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight">
            AI meal planning that{" "}
            <span className="text-emerald-600">understands your PCOS</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stop piecing together advice from Reddit, YouTube, and expensive dietitians. CycleEats generates personalized, low-glycemic, anti-inflammatory meal plans tailored to your symptoms and cycle phase.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-gray-300">
                See How It Works
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required. Free plan available forever.</p>

          {/* Hero visual */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-100 p-8 sm:p-12 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-emerald-600">AI</div>
                <p className="mt-2 text-sm text-gray-600">Personalized meal plans in seconds</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-emerald-600">Low-GI</div>
                <p className="mt-2 text-sm text-gray-600">Every recipe filtered for insulin impact</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-emerald-600">Why</div>
                <p className="mt-2 text-sm text-gray-600">Plain-language food explanations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-emerald-700 bg-emerald-50 border-emerald-200">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything generic apps get wrong, we get right
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              CycleEats is the first AI-native meal planner built with PCOS as the foundation, not an afterthought.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:border-emerald-200 transition-colors hover:shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-emerald-700 bg-emerald-50 border-emerald-200">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              From symptoms to meal plan in 3 steps
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              No complicated setup. No calorie counting. Just food that works for your body.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
                  {step.icon}
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <span className="text-5xl font-bold text-emerald-100">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Try It Now — Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof / Problem Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {"\""}Every mainstream app fails women with PCOS{"\""}
          </h2>
          <p className="text-xl text-emerald-100 leading-relaxed mb-8">
            Women with PCOS report that no existing app understands composite foods, hormonal context, or insulin resistance. They spend hours on Reddit and YouTube, or pay $200+ per dietitian session, just to figure out what to eat.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white">1 in 10</div>
              <p className="text-emerald-100 mt-2 text-sm">women of reproductive age have PCOS</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white">70%</div>
              <p className="text-emerald-100 mt-2 text-sm">of PCOS cases remain undiagnosed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white">0</div>
              <p className="text-emerald-100 mt-2 text-sm">AI-native PCOS meal planners exist today</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-emerald-700 bg-emerald-50 border-emerald-200">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Less than a single dietitian session
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Get unlimited, personalized PCOS meal plans for a fraction of what you{"'"}d pay for one nutrition consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${
                  tier.highlighted
                    ? "border-emerald-600 border-2 shadow-xl scale-105"
                    : "border-gray-200"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500 ml-2">/{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        tier.highlighted
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : ""
                      }`}
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-emerald-700 bg-emerald-50 border-emerald-200">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to eat for your PCOS, not against it?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Join thousands of women who are finally eating with confidence. Your personalized, PCOS-safe meal plan is just minutes away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Free forever plan available. No credit card needed.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-emerald-400" />
              <span className="text-lg font-bold text-white">CycleEats</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
              <a href="/login" className="hover:text-white transition-colors">
                Sign In
              </a>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; 2024 CycleEats. All rights reserved.</p>
            <p>AI meal planning built exclusively for women with PCOS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}