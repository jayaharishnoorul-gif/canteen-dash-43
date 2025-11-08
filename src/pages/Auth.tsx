import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/storage';
import { UserRole } from '@/types';
import { toast } from '@/hooks/use-toast';
import { UtensilsCrossed } from 'lucide-react';

export default function Auth() {
  const [loginMobile, setLoginMobile] = useState('');
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!loginMobile.trim()) {
      toast({ title: 'Error', description: 'Please enter mobile number', variant: 'destructive' });
      return;
    }

    const users = storage.getUsers();
    const user = users.find(u => u.mobile === loginMobile);

    if (!user) {
      toast({ title: 'Error', description: 'User not found. Please register first.', variant: 'destructive' });
      return;
    }

    login(user);
    toast({ title: 'Success', description: 'Login successful!' });
    
    if (user.role === 'manager') navigate('/manager');
    else if (user.role === 'worker') navigate('/worker');
    else navigate('/');
  };

  const handleRegister = () => {
    if (!regName.trim() || !regMobile.trim()) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const users = storage.getUsers();
    if (users.find(u => u.mobile === regMobile)) {
      toast({ title: 'Error', description: 'Mobile number already registered', variant: 'destructive' });
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: regName,
      mobile: regMobile,
      role: regRole,
      createdAt: Date.now(),
    };

    storage.addUser(newUser);
    login(newUser);
    toast({ title: 'Success', description: 'Registration successful!' });
    
    if (newUser.role === 'manager') navigate('/manager');
    else if (newUser.role === 'worker') navigate('/worker');
    else navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to CanteenOne</h1>
          <p className="mt-2 text-muted-foreground">Your digital canteen experience</p>
        </div>

        <Card className="shadow-custom-lg">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Login or create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginMobile">Mobile Number</Label>
                  <Input
                    id="loginMobile"
                    placeholder="Enter your mobile number"
                    type="tel"
                    value={loginMobile}
                    onChange={e => setLoginMobile(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                <Button className="w-full" onClick={handleLogin}>
                  Login
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Don't have an account? Switch to Register tab
                </p>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regName">Full Name</Label>
                  <Input
                    id="regName"
                    placeholder="Enter your full name"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regMobile">Mobile Number</Label>
                  <Input
                    id="regMobile"
                    placeholder="Enter your mobile number"
                    type="tel"
                    value={regMobile}
                    onChange={e => setRegMobile(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regRole">Role</Label>
                  <Select value={regRole} onValueChange={(v) => setRegRole(v as UserRole)}>
                    <SelectTrigger id="regRole">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User (Customer)</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="worker">Worker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleRegister}>
                  Register
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
