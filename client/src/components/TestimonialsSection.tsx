import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  content: string;
  author: string;
  location: string;
  rating: number;
  initials: string;
}

const Testimonial = ({ content, author, location, rating, initials }: TestimonialProps) => (
  <Card className="bg-white hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <div className="text-amber-400 flex">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill={i < rating ? "currentColor" : "none"}
              stroke={i < rating ? "none" : "currentColor"}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-secondary-700 italic mb-6">
        "{content}"
      </p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold mr-4">
          {initials}
        </div>
        <div>
          <h4 className="font-medium">{author}</h4>
          <p className="text-sm text-secondary-500">{location}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function TestimonialsSection() {
  const testimonials = [
    {
      content: "Thanks to CarvalueAI, I sold my BMW for €2,500 more than I initially planned. The detailed report helped me negotiate with confidence.",
      author: "Martin Dimitrov",
      location: "Sofia",
      rating: 5,
      initials: "MD"
    },
    {
      content: "As a small dealership owner, CarvalueAI has become essential for our business. The accuracy of valuations has improved our purchasing decisions significantly.",
      author: "Viktor Petrov",
      location: "Plovdiv",
      rating: 4.5,
      initials: "VP"
    },
    {
      content: "I was skeptical at first, but the valuation was spot on. The market comparison helped me set the right price, and I sold my car within a week.",
      author: "Ivana Todorova",
      location: "Varna",
      rating: 5,
      initials: "IT"
    }
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Real feedback from car owners and dealers across Bulgaria.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              location={testimonial.location}
              rating={testimonial.rating}
              initials={testimonial.initials}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
