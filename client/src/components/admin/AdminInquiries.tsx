import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
  assignedTo: number | null;
  notes: string | null;
};

export default function AdminInquiries({ userId }: { userId: number | null }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [updatingInquiry, setUpdatingInquiry] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", `/api/admin/inquiries?userId=${userId}`);
        const data = await response.json();
        setInquiries(data);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        toast({
          title: "Failed to load inquiries",
          description: "There was an error loading the inquiry data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchInquiries();
    }
  }, [userId, toast]);
  
  const handleMarkAsRead = async (inquiryId: number) => {
    try {
      setUpdatingInquiry(inquiryId);
      const response = await apiRequest(
        "PATCH", 
        `/api/admin/inquiries/${inquiryId}?userId=${userId}`,
        { status: "read", assignedTo: userId }
      );
      const updatedInquiry = await response.json();
      
      // Update the inquiry in the list
      setInquiries(inquiries.map(inquiry => 
        inquiry.id === inquiryId ? updatedInquiry : inquiry
      ));
      
      toast({
        title: "Inquiry Updated",
        description: `Inquiry #${inquiryId} marked as read`,
      });
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast({
        title: "Failed to update inquiry",
        description: "There was an error updating the inquiry status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingInquiry(null);
    }
  };
  
  const handleMarkAsReplied = async (inquiryId: number) => {
    try {
      setUpdatingInquiry(inquiryId);
      const response = await apiRequest(
        "PATCH", 
        `/api/admin/inquiries/${inquiryId}?userId=${userId}`,
        { status: "replied", assignedTo: userId }
      );
      const updatedInquiry = await response.json();
      
      // Update the inquiry in the list
      setInquiries(inquiries.map(inquiry => 
        inquiry.id === inquiryId ? updatedInquiry : inquiry
      ));
      
      toast({
        title: "Inquiry Updated",
        description: `Inquiry #${inquiryId} marked as replied`,
      });
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast({
        title: "Failed to update inquiry",
        description: "There was an error updating the inquiry status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingInquiry(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (inquiries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No inquiries found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inquiry Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>{inquiry.id}</TableCell>
                    <TableCell>{inquiry.name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.phone || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          inquiry.status === "unread" ? "destructive" : 
                          inquiry.status === "read" ? "outline" : 
                          inquiry.status === "replied" ? "default" : 
                          "secondary"
                        }
                      >
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {inquiry.status === "unread" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(inquiry.id)}
                            disabled={updatingInquiry === inquiry.id}
                            className="flex items-center gap-1"
                          >
                            {updatingInquiry === inquiry.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            <span>Mark Read</span>
                          </Button>
                        )}
                        
                        {(inquiry.status === "unread" || inquiry.status === "read") && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleMarkAsReplied(inquiry.id)}
                            disabled={updatingInquiry === inquiry.id}
                            className="flex items-center gap-1"
                          >
                            {updatingInquiry === inquiry.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            <span>Mark Replied</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}