import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      
      // Call the login API endpoint
      const response = await apiRequest("POST", "/api/login", data);
      const result = await response.json();
      
      // Store user info in localStorage for demo purposes
      // In a real app, would handle this via secure HTTP-only cookies or JWT
      if (result.user) {
        localStorage.setItem("userId", result.user.id);
        
        // Check if user is admin and redirect accordingly
        if (result.user.role === "admin") {
          localStorage.setItem("adminUserId", result.user.id);
          toast({
            title: "Admin Login Successful",
            description: "Welcome to the admin dashboard.",
          });
          navigate("/admin");
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back to CarValueAI.",
          });
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-secondary-900">Log In to CarValueAI</CardTitle>
            <CardDescription>
              Welcome back! Please log in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.email@example.com" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <a 
                          href="#" 
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary-600 hover:bg-primary-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="text-center mt-6">
              <p className="text-secondary-600">
                Don't have an account? <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Sign up</a>
              </p>
            </div>
            
            {/* For demo purposes - quick link to admin panel */}
            <div className="text-center mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Demo:</strong> To test the admin panel, use <code>admin@carvalueai.com</code> / <code>admin123</code>
              </p>
              <Button 
                variant="outline" 
                className="mt-2 text-xs" 
                size="sm"
                onClick={() => {
                  // Demo shortcut to admin panel
                  localStorage.setItem("adminUserId", "1");
                  navigate("/admin");
                }}
              >
                Quick Admin Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
