import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type User = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  plan: string;
  apiKey: string | null;
  usageLimit: number | null;
  usageCount: number | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export default function AdminUsers({ userId }: { userId: number | null }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [generatingApiKey, setGeneratingApiKey] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", `/api/admin/users?userId=${userId}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Failed to load users",
          description: "There was an error loading the user data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchUsers();
    }
  }, [userId, toast]);
  
  const handleGenerateApiKey = async (targetUserId: number) => {
    try {
      setGeneratingApiKey(targetUserId);
      const response = await apiRequest(
        "POST", 
        `/api/admin/users/${targetUserId}/generate-api-key?userId=${userId}`
      );
      const data = await response.json();
      
      // Update the user in the list with new API key
      setUsers(users.map(user => 
        user.id === targetUserId ? { ...user, apiKey: data.apiKey } : user
      ));
      
      toast({
        title: "API Key Generated",
        description: `New API key generated for user #${targetUserId}`,
      });
    } catch (error) {
      console.error("Error generating API key:", error);
      toast({
        title: "Failed to generate API key",
        description: "There was an error generating the API key.",
        variant: "destructive",
      });
    } finally {
      setGeneratingApiKey(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No users found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.apiKey ? (
                        <span className="text-xs font-mono">
                          {user.apiKey.substring(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No API key</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'success' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateApiKey(user.id)}
                        disabled={generatingApiKey === user.id}
                        className="flex items-center gap-1"
                      >
                        {generatingApiKey === user.id ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Key className="h-3 w-3" />
                            <span>Generate API Key</span>
                          </>
                        )}
                      </Button>
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