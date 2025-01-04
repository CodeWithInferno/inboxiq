import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const Pricing = () => {
  const pricingPlans = [
    {
      title: "Basic",
      price: "Free",
      period: "forever",
      features: [
        "Up to 100 emails per month",
        "Basic AI Filters",
        "Community Support",
      ],
      buttonLabel: "Get Started",
      popular: false,
    },
    {
      title: "Pro",
      price: "$9.99",
      period: "per month",
      features: [
        "Unlimited emails",
        "Advanced AI Filters",
        "Priority Support",
        "Custom Rules & Automation",
      ],
      buttonLabel: "Try Pro",
      popular: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Team Collaboration Tools",
        "Dedicated Support",
        "Custom AI Models",
        "Enterprise-Level Security",
      ],
      buttonLabel: "Contact Us",
      popular: false,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="inline-block text-sm font-semibold text-purple-600 dark:text-purple-400 px-4 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 mb-4">
            Pricing
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
            Choose your perfect plan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Start with our free tier and scale as you grow. All plans include core features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative group ${plan.popular ? 'md:-mt-8' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 text-center">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-400 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`
                h-full flex flex-col p-8 rounded-2xl transition-all duration-300
                ${plan.popular 
                  ? 'bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/30 dark:to-gray-800 shadow-xl shadow-purple-500/10 dark:shadow-purple-800/10 border-2 border-purple-500/20' 
                  : 'bg-white dark:bg-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-gray-200/70 dark:hover:shadow-gray-900/70'}
              `}>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.title}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="mb-8 space-y-4 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`
                    w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300
                    ${plan.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                      : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'}
                    transform hover:scale-[1.02] active:scale-[0.98]
                  `}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;