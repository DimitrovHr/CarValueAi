import { cn } from "@/lib/utils";

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  isEven: boolean;
}

const ProcessStep = ({ number, title, description, imageSrc, imageAlt, isEven }: ProcessStepProps) => (
  <div className="md:grid md:grid-cols-2 md:gap-8 items-center mb-12 md:mb-0">
    <div className={cn("md:relative mb-6 md:mb-0", isEven ? "order-last md:order-first" : "")}>
      <div className={cn(
        "hidden md:block absolute top-1/2 w-4 h-4 bg-primary-500 rounded-full transform -translate-y-1/2",
        isEven ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
      )}></div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="w-full h-auto"
        />
      </div>
    </div>
    <div className={cn(
      "flex flex-col",
      isEven ? "md:pl-12" : "md:text-right md:pr-12"
    )}>
      <div className={cn(
        "flex flex-col",
        isEven ? "" : "md:items-end"
      )}>
        <div className={cn(
          "bg-primary-100 text-primary-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4",
          isEven ? "" : "md:ml-auto"
        )}>
          {number}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-secondary-600">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Enter Your Car Details",
      description: "Provide basic information about your vehicle including make, model, year, mileage, and condition.",
      imageSrc: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      imageAlt: "Person entering car details on a laptop"
    },
    {
      number: 2,
      title: "AI Data Analysis",
      description: "Our AI analyzes thousands of comparable vehicles from Bulgarian marketplaces to match your car's specifications.",
      imageSrc: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      imageAlt: "AI system analyzing car data"
    },
    {
      number: 3,
      title: "Get Your Valuation",
      description: "Receive a detailed valuation report with price ranges, confidence score, and market insights.",
      imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      imageAlt: "Car valuation report with charts"
    },
    {
      number: 4,
      title: "Make Informed Decisions",
      description: "Use your valuation to negotiate better prices, set fair selling prices, or understand your car's current market position.",
      imageSrc: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      imageAlt: "Person making decision with valuation report"
    }
  ];
  
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How CarvalueAI Works</h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Our AI-powered valuation process is simple, fast, and accurate.
          </p>
        </div>
        
        <div className="relative">
          {/* Process Steps Timeline */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary-100 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <ProcessStep
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                imageSrc={step.imageSrc}
                imageAlt={step.imageAlt}
                isEven={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
