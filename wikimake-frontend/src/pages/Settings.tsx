import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  User, 
  Eye,
  Mail,
  Globe,
  Lock,
  Save,
  RotateCcw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';

interface UserSettings {
  notifications: {
    email: {
      enabled: boolean;
      submissionApproved: boolean;
      submissionRejected: boolean;
      badgeEarned: boolean;
      weeklyDigest: boolean;
    };
    push: {
      enabled: boolean;
      submissionApproved: boolean;
      submissionRejected: boolean;
      badgeEarned: boolean;
    };
    inApp: {
      enabled: boolean;
      submissionApproved: boolean;
      submissionRejected: boolean;
      badgeEarned: boolean;
      verificationRequest: boolean;
    };
  };
  privacy: {
    profileVisibility: 'public' | 'community' | 'private';
    showEmail: boolean;
    showCountry: boolean;
    showBadges: boolean;
    showActivity: boolean;
    allowMessages: boolean;
  };
  display: {
    language: string;
    itemsPerPage: number;
    compactMode: boolean;
  };
  account: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    autoLogout: boolean;
  };
}

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.settings);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      await api.put('/settings', settings);
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default?')) return;
    
    try {
      const response = await api.post('/settings/reset', {});
      setSettings(response.settings);
      toast.success('Settings reset to default');
    } catch (error) {
      toast.error('Failed to reset settings');
    }
  };

  const updateSettings = (path: string[], value: any) => {
    if (!settings) return;
    
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <SettingsIcon className="h-8 w-8" />
                Settings
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your account preferences and application settings
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="dark:border-gray-700 dark:text-gray-300">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Email Notifications</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Manage email notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Label className="dark:text-gray-300">Enable Email Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.email.enabled}
                    onCheckedChange={(checked) => updateSettings(['notifications', 'email', 'enabled'], checked)}
                  />
                </div>

                {settings.notifications.email.enabled && (
                  <div className="ml-6 space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm dark:text-gray-400">Submission Approved</Label>
                      <Switch
                        checked={settings.notifications.email.submissionApproved}
                        onCheckedChange={(checked) => updateSettings(['notifications', 'email', 'submissionApproved'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm dark:text-gray-400">Submission Rejected</Label>
                      <Switch
                        checked={settings.notifications.email.submissionRejected}
                        onCheckedChange={(checked) => updateSettings(['notifications', 'email', 'submissionRejected'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm dark:text-gray-400">Badge Earned</Label>
                      <Switch
                        checked={settings.notifications.email.badgeEarned}
                        onCheckedChange={(checked) => updateSettings(['notifications', 'email', 'badgeEarned'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm dark:text-gray-400">Weekly Digest</Label>
                      <Switch
                        checked={settings.notifications.email.weeklyDigest}
                        onCheckedChange={(checked) => updateSettings(['notifications', 'email', 'weeklyDigest'], checked)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">In-App Notifications</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Manage in-app notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Label className="dark:text-gray-300">Enable In-App Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.inApp.enabled}
                    onCheckedChange={(checked) => updateSettings(['notifications', 'inApp', 'enabled'], checked)}
                  />
                </div>

                {settings.notifications.inApp.enabled && (
                  <div className="ml-6 space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm dark:text-gray-400">Submission Approved</Label>
                      <Switch
                        checked={settings.notifications.inApp.submissionApproved}
                        onCheckedChange={(checked) => updateSettings(['notifications', 'inApp', 'submissionApproved'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm dark:text-gray-400">Submission Rejected</Label>
                      <Switch
                        checked={settings.notifications.inApp.submissionRejected}
                        onCheckedChange={(checked) => updateSettings(['notifications', 'inApp', 'submissionRejected'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm dark:text-gray-400">Badge Earned</Label>
                      <Switch
                        checked={settings.notifications.inApp.badgeEarned}
                        onCheckedChange={(checked) => updateSettings(['notifications', 'inApp', 'badgeEarned'], checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm dark:text-gray-400">Verification Request</Label>
                      <Switch
                        checked={settings.notifications.inApp.verificationRequest}
                        onCheckedChange={(checked) => updateSettings(['notifications', 'inApp', 'verificationRequest'], checked)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Profile Visibility</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Control who can see your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-300">Profile Visibility</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => updateSettings(['privacy', 'profileVisibility'], value)}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="public">Public - Anyone can view</SelectItem>
                      <SelectItem value="community">Community - Only registered users</SelectItem>
                      <SelectItem value="private">Private - Only you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="dark:bg-gray-700" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Label className="dark:text-gray-300">Show Email</Label>
                    </div>
                    <Switch
                      checked={settings.privacy.showEmail}
                      onCheckedChange={(checked) => updateSettings(['privacy', 'showEmail'], checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Label className="dark:text-gray-300">Show Country</Label>
                    </div>
                    <Switch
                      checked={settings.privacy.showCountry}
                      onCheckedChange={(checked) => updateSettings(['privacy', 'showCountry'], checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="dark:text-gray-300">Show Badges</Label>
                    <Switch
                      checked={settings.privacy.showBadges}
                      onCheckedChange={(checked) => updateSettings(['privacy', 'showBadges'], checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="dark:text-gray-300">Show Activity</Label>
                    <Switch
                      checked={settings.privacy.showActivity}
                      onCheckedChange={(checked) => updateSettings(['privacy', 'showActivity'], checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="dark:text-gray-300">Allow Messages</Label>
                    <Switch
                      checked={settings.privacy.allowMessages}
                      onCheckedChange={(checked) => updateSettings(['privacy', 'allowMessages'], checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Security</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <Label className="dark:text-gray-300">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.account.twoFactorEnabled}
                    onCheckedChange={(checked) => updateSettings(['account', 'twoFactorEnabled'], checked)}
                  />
                </div>

                <Separator className="dark:bg-gray-700" />

                <div className="space-y-2">
                  <Label className="dark:text-gray-300">Session Timeout (minutes)</Label>
                  <Select
                    value={settings.account.sessionTimeout.toString()}
                    onValueChange={(value) => updateSettings(['account', 'sessionTimeout'], parseInt(value))}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-300">Auto Logout</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically log out after session timeout
                    </p>
                  </div>
                  <Switch
                    checked={settings.account.autoLogout}
                    onCheckedChange={(checked) => updateSettings(['account', 'autoLogout'], checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700 border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
