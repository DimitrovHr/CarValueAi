import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ValuationForm from "./ValuationForm";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <img 
          src="https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Modern car showroom" 
          className="object-cover w-full h-full"
        />
      </div>
      
      {/* Special Promotion Banner */}
      <div className="relative bg-accent-500 py-2 text-center text-white">
        <div className="container mx-auto px-4">
          <p className="text-sm md:text-base font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Special offer for first 50 clients: 30% discount on all plans!
          </p>
        </div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 max-w-4xl">
          The Smart Way to Value Your Car in Bulgaria
        </h1>
        <p className="text-lg md:text-xl text-center mb-8 max-w-2xl text-gray-100">
          Get accurate, AI-powered valuations based on real market data from mobile.bg, cars.bg, and social media groups.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button 
            onClick={() => scrollToSection('valuation-form')}
            size="lg"
            className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Value Your Car Now
          </Button>
          <Button 
            onClick={() => scrollToSection('how-it-works')}
            variant="outline"
            size="lg"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            How It Works
          </Button>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl max-w-4xl w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Try Our 60-Day Free Trial</h2>
            <p className="text-gray-100">No credit card required. Cancel anytime.</p>
          </div>
          
          <ValuationForm />
        </div>
      </div>
    </section>
  );
}
