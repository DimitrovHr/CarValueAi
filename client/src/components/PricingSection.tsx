import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface PricingPlanProps {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: Array<{ text: string; included: boolean }>;
  buttonText: string;
  buttonAction: () => void;
  isPopular?: boolean;
}

const PricingPlan = ({
  title,
  subtitle,
  price,
  period,
  features,
  buttonText,
  buttonAction,
  isPopular = false
}: PricingPlanProps) => (
  <div className={cn(
    "pricing-card flex-1 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100",
    isPopular && "pricing-card-popular bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 relative z-10"
  )}>
    {isPopular && (
      <div className="absolute top-0 inset-x-0 bg-primary-500 text-white py-2 text-center text-sm font-semibold">
        MOST POPULAR
      </div>
    )}
    <div className={cn("p-8", isPopular && "pt-16")}>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-secondary-600 mb-6">{subtitle}</p>
      <div className="flex items-end mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-secondary-600 ml-2">{period}</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className={cn("flex items-start", !feature.included && "opacity-50")}>
            {feature.included ? <CheckIcon /> : <CrossIcon />}
            <span className="ml-3">{feature.text}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={buttonAction}
        variant={isPopular ? "default" : "outline"}
        className={cn(
          "w-full py-3 px-6 text-center font-semibold rounded-lg transition-colors",
          isPopular ? "bg-primary-600 hover:bg-primary-700 text-white" : "bg-gray-100 text-primary-700 hover:bg-gray-200"
        )}
      >
        {buttonText}
      </Button>
    </div>
  </div>
);

interface ComparisonRowProps {
  feature: string;
  regular: React.ReactNode;
  premium: React.ReactNode;
  business: React.ReactNode;
}

const ComparisonRow = ({ feature, regular, premium, business }: ComparisonRowProps) => (
  <tr className="border-b border-gray-200">
    <td className="py-4 px-4">{feature}</td>
    <td className="text-center py-4 px-4">{regular}</td>
    <td className="text-center py-4 px-4">{premium}</td>
    <td className="text-center py-4 px-4">{business}</td>
  </tr>
);

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const handleStartTrial = () => {
    alert("Starting 60-Day Free Trial!");
  };

  const handleContactSales = () => {
    window.location.href = "#contact";
  };

  const pricingPlans = [
    {
      title: "Regular",
      subtitle: "For individual car owners",
      price: "€14.99",
      period: "/ month",
      features: [
        { text: "10 valuations per month", included: true },
        { text: "Basic valuation report", included: true },
        { text: "Email support", included: true },
        { text: "Market trend insights", included: true },
        { text: "Detailed comparison reports", included: false },
        { text: "API access", included: false },
      ],
      buttonText: "Start 60-Day Free Trial",
      buttonAction: handleStartTrial
    },
    {
      title: "Premium",
      subtitle: "For serious buyers and sellers",
      price: "€29.99",
      period: "/ month",
      features: [
        { text: "30 valuations per month", included: true },
        { text: "Detailed valuation report", included: true },
        { text: "Priority email support", included: true },
        { text: "Market trend insights", included: true },
        { text: "Detailed comparison reports", included: true },
        { text: "API access", included: false },
      ],
      buttonText: "Start 60-Day Free Trial",
      buttonAction: handleStartTrial,
      isPopular: true
    },
    {
      title: "Business",
      subtitle: "For dealerships and professionals",
      price: "Custom",
      period: "pricing",
      features: [
        { text: "Unlimited valuations", included: true },
        { text: "Advanced valuation report", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Advanced market analytics", included: true },
        { text: "Detailed comparison reports", included: true },
        { text: "API access", included: true },
      ],
      buttonText: "Contact Sales",
      buttonAction: handleContactSales
    }
  ];

  const comparisonRows = [
    {
      feature: "Monthly valuations",
      regular: "10",
      premium: "30",
      business: "Unlimited"
    },
    {
      feature: "Report detail level",
      regular: "Basic",
      premium: "Detailed",
      business: "Advanced"
    },
    {
      feature: "Support",
      regular: "Email",
      premium: "Priority Email",
      business: "Dedicated Manager"
    },
    {
      feature: "Market trend insights",
      regular: "Basic",
      premium: "Advanced",
      business: "Premium"
    },
    {
      feature: "Comparison reports",
      regular: <CrossIcon />,
      premium: <CheckIcon />,
      business: <CheckIcon />
    },
    {
      feature: "API access",
      regular: <CrossIcon />,
      premium: <CrossIcon />,
      business: <CheckIcon />
    },
    {
      feature: "White-label reports",
      regular: <CrossIcon />,
      premium: <CrossIcon />,
      business: <CheckIcon />
    },
    {
      feature: "Historical data access",
      regular: "30 days",
      premium: "90 days",
      business: "1 year"
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Choose the plan that's right for you with our 60-day money-back guarantee.
          </p>
          <div className="mt-6 inline-block bg-gray-100 p-1 rounded-lg">
            <Button
              onClick={() => setBillingPeriod('monthly')}
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
              className={cn(
                "px-4 py-2 rounded-md font-medium", 
                billingPeriod === 'monthly' ? "bg-white shadow text-primary-700" : "text-secondary-600"
              )}
            >
              Monthly
            </Button>
            <Button
              onClick={() => setBillingPeriod('annual')}
              variant={billingPeriod === 'annual' ? 'default' : 'ghost'}
              className={cn(
                "px-4 py-2 rounded-md font-medium", 
                billingPeriod === 'annual' ? "bg-white shadow text-primary-700" : "text-secondary-600"
              )}
            >
              Annual (Save 20%)
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingPlan
              key={index}
              title={plan.title}
              subtitle={plan.subtitle}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonAction={plan.buttonAction}
              isPopular={plan.isPopular}
            />
          ))}
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Compare All Features</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Regular</th>
                  <th className="text-center py-4 px-4">Premium</th>
                  <th className="text-center py-4 px-4">Business</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <ComparisonRow
                    key={index}
                    feature={row.feature}
                    regular={row.regular}
                    premium={row.premium}
                    business={row.business}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
