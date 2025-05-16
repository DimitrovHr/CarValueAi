import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type CarValuation = {
  id: number;
  userId: number | null;
  clientEmail: string | null;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: string;
  confidence: string;
  marketTrend: string;
  status: string;
  createdAt: string;
  isPaid: boolean;
  requestSource: string;
};

export default function AdminValuations({ userId }: { userId: number | null }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [valuations, setValuations] = useState<CarValuation[]>([]);
  
  useEffect(() => {
    const fetchValuations = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", `/api/admin/valuations?userId=${userId}`);
        const data = await response.json();
        setValuations(data);
      } catch (error) {
        console.error("Error fetching valuations:", error);
        toast({
          title: "Failed to load valuations",
          description: "There was an error loading the valuation data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchValuations();
    }
  }, [userId, toast]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (valuations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No valuations found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Valuation Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>All Valuations ({valuations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User/Client</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {valuations.map((valuation) => (
                  <TableRow key={valuation.id}>
                    <TableCell>{valuation.id}</TableCell>
                    <TableCell>
                      {valuation.userId ? `User #${valuation.userId}` : null}
                      {valuation.clientEmail ? <div className="text-xs text-muted-foreground">{valuation.clientEmail}</div> : null}
                    </TableCell>
                    <TableCell>
                      <div>{valuation.make} {valuation.model}</div>
                      <div className="text-xs text-muted-foreground">{valuation.year}, {valuation.mileage} km, {valuation.condition}</div>
                    </TableCell>
                    <TableCell>€{Number(valuation.estimatedValue).toLocaleString()}</TableCell>
                    <TableCell>{(Number(valuation.confidence) * 100).toFixed()}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {valuation.marketTrend}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          valuation.status === "completed" ? "default" : 
                          valuation.status === "pending" ? "secondary" : 
                          "destructive"
                        }
                      >
                        {valuation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={valuation.isPaid ? "default" : "outline"}
                      >
                        {valuation.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {valuation.requestSource}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(valuation.createdAt).toLocaleDateString()}
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