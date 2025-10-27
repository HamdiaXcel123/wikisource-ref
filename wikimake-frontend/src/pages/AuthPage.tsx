import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../lib/auth-context';
import { COUNTRIES } from '../lib/constants';
import { authApi } from '../lib/api';
import { toast } from 'sonner';
import { Loader2, Globe } from 'lucide-react';
import { Separator } from '../components/ui/separator';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [setupUserId, setSetupUserId] = useState('');
  const [setupCountry, setSetupCountry] = useState('');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerCountry, setRegisterCountry] = useState('');

  useEffect(() => {
    // Check if returning from Wikimedia OAuth
    const setup = searchParams.get('setup');
    const userId = searchParams.get('userId');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Authentication failed. Please try again.');
    }

    if (setup === 'true' && userId) {
      setShowSetup(true);
      setSetupUserId(userId);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginUsername.trim() || !loginPassword.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      const success = await login(loginUsername, loginPassword);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      // Error already handled in auth context with toast
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerUsername.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (!registerEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!registerPassword.trim()) {
      toast.error('Please enter a password');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!registerCountry) {
      toast.error('Please select a country');
      return;
    }

    setLoading(true);

    try {
      const success = await register(registerUsername, registerEmail, registerPassword, registerCountry);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      // Error already handled in auth context with toast
    } finally {
      setLoading(false);
    }
  };

  const handleWikimediaLogin = () => {
    const wikimediaUrl = authApi.getWikimediaAuthUrl();
    window.location.href = wikimediaUrl;
  };

  const handleSetupComplete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!setupCountry) {
      toast.error('Please select a country');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.completeWikimediaSetup(setupUserId, setupCountry);
      if (response.success) {
        toast.success('Setup complete! Welcome to WikiSourceRef');
        navigate('/');
      }
    } catch (error) {
      toast.error('Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Setup</CardTitle>
              <CardDescription>
                Please select your country to complete registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetupComplete} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="setup-country">Country</Label>
                  <Select value={setupCountry} onValueChange={setSetupCountry}>
                    <SelectTrigger id="setup-country">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing setup...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="mb-2 dark:text-white">Welcome to WikiSourceRef</h1>
          <p className="text-gray-600 dark:text-gray-300">Sign in or create an account to get started</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Your username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>

                  <div className="relative my-4">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">
                      OR
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleWikimediaLogin}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Login with Wikimedia
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join the Wikipedia source verification community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Choose a username"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-country">Country</Label>
                    <Select value={registerCountry} onValueChange={setRegisterCountry}>
                      <SelectTrigger id="register-country">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="bg-amber-50 p-4 rounded-md">
                    <p className="text-sm text-amber-800">
                      By registering, you agree to help maintain Wikipedia's source quality standards.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
