import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { carMakes, carModels, carYears, carConditions } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

const valuationFormSchema = z.object({
  make: z.string().min(1, "Please select a make"),
  model: z.string().min(1, "Please select a model"),
  year: z.string().min(1, "Please select a year"),
  mileage: z.string().min(1, "Please enter mileage"),
  vin: z.string().optional(), // Optional VIN field for more precise valuations
  condition: z.enum(["excellent", "very-good", "good", "fair", "poor"], { 
    required_error: "Please select a condition" 
  })
});

type ValuationFormValues = z.infer<typeof valuationFormSchema>;

type ValuationResult = {
  estimatedValue: number;
  confidence: number;
  marketTrend: string;
  summary: string;
};

export default function ValuationForm() {
  const { toast } = useToast();
  const [availableModels, setAvailableModels] = useState<Array<{ value: string, label: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  
  const form = useForm<ValuationFormValues>({
    resolver: zodResolver(valuationFormSchema),
    defaultValues: {
      make: "select-make",
      model: "",
      year: "",
      mileage: "",
      vin: "",
      condition: "good"
    }
  });
  
  // Update available models when make changes
  const handleMakeChange = (value: string) => {
    form.setValue("model", "");
    if (value && carModels[value]) {
      setAvailableModels(carModels[value]);
    } else {
      setAvailableModels([]);
    }
  };
  
  async function onSubmit(data: ValuationFormValues) {
    try {
      setIsLoading(true);
      setValuationResult(null);
      
      // Convert mileage and year to numbers and include VIN if provided
      const payload = {
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        mileage: parseInt(data.mileage),
        condition: data.condition,
        vin: data.vin || undefined // Only include if user provided a VIN
      };
      
      // Call the API
      const response = await apiRequest('POST', '/api/quick-valuation', payload);
      const result = await response.json();
      
      setValuationResult(result);
      
      toast({
        title: "Valuation complete!",
        description: "We've analyzed your car's value based on the Bulgarian market.",
      });
    } catch (error) {
      console.error('Valuation error:', error);
      toast({
        title: "Valuation failed",
        description: "There was an error processing your valuation request.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form id="valuation-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-2 text-white">Make</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleMakeChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent backdrop-blur-sm">
                      <SelectValue placeholder="Select Make" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {carMakes.map((make) => (
                      <SelectItem 
                        key={make.value} 
                        value={make.value} 
                        disabled={make.disabled}
                      >
                        {make.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-white/80" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-2 text-white">Model</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent backdrop-blur-sm">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableModels.length > 0 ? (
                      availableModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key="no-model" value="no-model" disabled>
                        Select Make First
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-white/80" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-2 text-white">Year</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent backdrop-blur-sm">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {carYears.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-white/80" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-2 text-white">Mileage (km)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 120000" 
                    className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent backdrop-blur-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white/80" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-2 text-white">
                  VIN (Optional)
                  <span className="ml-1 text-xs text-white/70">- For more accurate valuations</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. WVWZZZ1KZAM654321" 
                    className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent backdrop-blur-sm uppercase"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white/80" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="block text-sm font-medium mb-2 text-white">Condition</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-3 sm:grid-cols-5 gap-3"
                  >
                    {carConditions.map((condition) => (
                      <div key={condition.value} className="flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg cursor-pointer transition-colors">
                        <RadioGroupItem value={condition.value} id={`condition-${condition.value}`} className="sr-only" />
                        <label htmlFor={`condition-${condition.value}`} className="cursor-pointer w-full text-center">
                          {condition.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-white/80" />
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <Button 
              type="submit" 
              className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold p-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Free Valuation"
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      {valuationResult && (
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Car Valuation Result</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="text-white/80 text-sm mb-1">Estimated Value</h4>
                <p className="text-3xl font-bold text-white">€{valuationResult.estimatedValue.toLocaleString()}</p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="text-white/80 text-sm mb-1">Market Trend</h4>
                <p className="text-xl font-semibold text-white capitalize">
                  {valuationResult.marketTrend === "rising" && "↗️ Rising"}
                  {valuationResult.marketTrend === "stable" && "→ Stable"}
                  {valuationResult.marketTrend === "declining" && "↘️ Declining"}
                </p>
              </div>
            </div>
            
            <div className="mt-4 bg-white/10 p-4 rounded-lg">
              <h4 className="text-white/80 text-sm mb-1">Summary</h4>
              <p className="text-white">{valuationResult.summary}</p>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm mb-2">Confidence Score: {(valuationResult.confidence * 100).toFixed(0)}%</p>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-accent-500 h-2 rounded-full" style={{ width: `${valuationResult.confidence * 100}%` }}></div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm">
                Want a more detailed analysis with future value prediction?
              </p>
              <Button 
                onClick={() => window.location.href = "/#pricing"}
                variant="outline"
                className="mt-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
