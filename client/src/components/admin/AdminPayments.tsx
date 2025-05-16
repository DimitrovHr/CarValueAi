import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Payment = {
  id: number;
  userId: number | null;
  valuationId: number | null;
  amount: string;
  currency: string;
  status: string;
  paymentMethod: string | null;
  paymentDate: string | null;
  createdAt: string;
  transactionId: string | null;
  invoiceNumber: string | null;
};

export default function AdminPayments({ userId }: { userId: number | null }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", `/api/admin/payments?userId=${userId}`);
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast({
          title: "Failed to load payments",
          description: "There was an error loading the payment data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchPayments();
    }
  }, [userId, toast]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No payments found.</p>
      </div>
    );
  }

  // Calculate total revenue
  const totalRevenue = payments
    .filter(payment => payment.status === "completed")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(payment => payment.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Payments ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Valuation</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>
                      {payment.userId ? `User #${payment.userId}` : "-"}
                    </TableCell>
                    <TableCell>
                      {payment.valuationId ? `#${payment.valuationId}` : "-"}
                    </TableCell>
                    <TableCell>
                      {payment.currency === "EUR" ? "€" : payment.currency}
                      {Number(payment.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          payment.status === "completed" ? "default" : 
                          payment.status === "pending" ? "secondary" : 
                          payment.status === "refunded" ? "outline" :
                          "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">
                      {payment.paymentMethod || "-"}
                    </TableCell>
                    <TableCell>
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 
                       new Date(payment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {payment.transactionId || "-"}
                    </TableCell>
                    <TableCell>
                      {payment.invoiceNumber || "-"}
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