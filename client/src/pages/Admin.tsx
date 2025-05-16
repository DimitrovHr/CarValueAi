import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Users, MessageSquare, CreditCard, BarChart3, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminInquiries from "@/components/admin/AdminInquiries";
import AdminPayments from "@/components/admin/AdminPayments";
import AdminValuations from "@/components/admin/AdminValuations";

export default function Admin() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  useEffect(() => {
    // In a real app, you would check from a JWT or session
    // For demo purposes, we'll use localStorage and prompt for userId
    const checkAdminStatus = async () => {
      try {
        // For demo purposes, we'll just skip the API verification
        // and show the admin panel
        setIsAdmin(true);
        setUserId(1); // Assuming the admin user has ID 1
        setIsLoading(false);
        
        // In a production app, we would verify admin status with the API:
        /*
        const storedUserId = localStorage.getItem("adminUserId");
        
        if (!storedUserId) {
          const id = prompt("Enter admin user ID for demo purposes:");
          if (id) {
            localStorage.setItem("adminUserId", id);
            setUserId(Number(id));
          } else {
            setLocation("/");
            return;
          }
        } else {
          setUserId(Number(storedUserId));
        }
        
        // Make an admin API call to verify admin status
        await apiRequest("GET", `/api/admin/dashboard?userId=${userId || storedUserId}`);
        */
      } catch (error) {
        console.error("Admin verification error:", error);
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive"
        });
        setLocation("/");
      }
    };
    
    checkAdminStatus();
  }, [setLocation, toast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg">Verifying admin access...</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Will be redirected in useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => setLocation("/")}>
            Back to Website
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              localStorage.removeItem("adminUserId");
              setLocation("/");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Inquiries</span>
          </TabsTrigger>
          <TabsTrigger value="valuations" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>Valuations</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Payments</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AdminDashboard userId={userId} />
        </TabsContent>
        
        <TabsContent value="users">
          <AdminUsers userId={userId} />
        </TabsContent>
        
        <TabsContent value="inquiries">
          <AdminInquiries userId={userId} />
        </TabsContent>
        
        <TabsContent value="valuations">
          <AdminValuations userId={userId} />
        </TabsContent>
        
        <TabsContent value="payments">
          <AdminPayments userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}