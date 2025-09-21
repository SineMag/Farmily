import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User, Tractor, Truck } from 'lucide-react';

export function LoginForm() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'customer' | 'farmer' | 'driver'>('customer');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Find user with matching email and role
    const user = state.users.find(u => 
      u.email === formData.email && u.role === userType
    );

    if (!user) {
      setError('Invalid email or user type. Please check your credentials.');
      return;
    }

    // In a real app, you'd verify the password here
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
    
    // Redirect based on user role
    switch (user.role) {
      case 'farmer':
        navigate('/farmer/dashboard');
        break;
      case 'driver':
        navigate('/driver/dashboard');
        break;
      default:
        navigate('/products');
    }
  };

  const quickLoginOptions = {
    customer: { email: 'customer@example.com', name: 'Demo Customer' },
    farmer: { email: 'farmer@greenvalley.com', name: 'John Green (Green Valley Farm)' },
    driver: { email: 'driver@farmily.com', name: 'Mike Delivery' }
  };

  const handleQuickLogin = (type: keyof typeof quickLoginOptions) => {
    const user = state.users.find(u => u.email === quickLoginOptions[type].email);
    if (user) {
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      switch (user.role) {
        case 'farmer':
          navigate('/farmer/dashboard');
          break;
        case 'driver':
          navigate('/driver/dashboard');
          break;
        default:
          navigate('/products');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Tractor className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-center text-3xl text-gray-900">
            Welcome to Farmily
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Choose your account type and sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="farmer" className="flex items-center gap-2">
                  <Tractor className="h-4 w-4" />
                  Farmer
                </TabsTrigger>
                <TabsTrigger value="driver" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Driver
                </TabsTrigger>
              </TabsList>

              <TabsContent value={userType} className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>

                {/* Quick Login for Demo */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Demo Quick Login:</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleQuickLogin(userType)}
                  >
                    Login as {quickLoginOptions[userType].name}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-600 hover:text-green-500">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}