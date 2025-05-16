import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { carMakes, carModels, carYears, carConditions } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const valuationFormSchema = z.object({
  make: z.string().min(1, "Please select a make"),
  model: z.string().min(1, "Please select a model"),
  year: z.string().min(1, "Please select a year"),
  mileage: z.string().min(1, "Please enter mileage"),
  condition: z.enum(["excellent", "very-good", "good", "fair", "poor"], { 
    required_error: "Please select a condition" 
  })
});

type ValuationFormValues = z.infer<typeof valuationFormSchema>;

export default function ValuationForm() {
  const { toast } = useToast();
  const [availableModels, setAvailableModels] = useState<Array<{ value: string, label: string }>>([]);
  
  const form = useForm<ValuationFormValues>({
    resolver: zodResolver(valuationFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      mileage: "",
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
  
  function onSubmit(data: ValuationFormValues) {
    console.log(data);
    
    toast({
      title: "Valuation submitted!",
      description: "We're processing your car valuation request.",
    });
    
    // Here you would normally send the data to your backend
  }
  
  return (
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
            </FormItem>
          )}
        />
        
        <div className="md:col-span-2">
          <Button 
            type="submit" 
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold p-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Get Free Valuation
          </Button>
        </div>
      </form>
    </Form>
  );
}
