import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { 
  Activity as ActivityIcon, 
  FileText, 
  CheckCircle, 
  Award, 
  UserPlus,
  Settings as SettingsIcon,
  LogIn,
  LogOut,
  Users,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  _id: string;
  user: {
    _id: string;
    username: string;
    country: string;
    role: string;
    badges: any[];
  };
  type: string;
  description: string;
  metadata?: any;
  createdAt: string;
}

export default function ActivityFeed() {
  const { user } = useAuth();
  const [myActivities, setMyActivities] = useState<Activity[]>([]);
  const [communityActivities, setCommunityActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my' | 'community'>('my');

  useEffect(() => {
    fetchActivities();
  }, [activeTab]);

  const fetchActivities = async () => {
    try {
      if (activeTab === 'my') {
        const response = await api.get('/activities');
        setMyActivities(response.activities);
      } else {
        const response = await api.get('/activities/community');
        setCommunityActivities(response.activities);
      }
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission_created':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'submission_verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'badge_earned':
        return <Award className="h-5 w-5 text-yellow-600" />;
      case 'role_changed':
        return <UserPlus className="h-5 w-5 text-purple-600" />;
      case 'profile_updated':
        return <SettingsIcon className="h-5 w-5 text-gray-600" />;
      case 'login':
        return <LogIn className="h-5 w-5 text-green-600" />;
      case 'logout':
        return <LogOut className="h-5 w-5 text-gray-600" />;
      default:
        return <ActivityIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'submission_created':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'submission_verified':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'badge_earned':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'role_changed':
        return 'bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ActivityIcon className="h-8 w-8" />
            Activity Feed
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your activities and see what's happening in the community
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'my' | 'community')} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <TabsTrigger value="my" className="dark:data-[state=active]:bg-gray-700">
              <ActivityIcon className="h-4 w-4 mr-2" />
              My Activity
            </TabsTrigger>
            <TabsTrigger value="community" className="dark:data-[state=active]:bg-gray-700">
              <Users className="h-4 w-4 mr-2" />
              Community Feed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="space-y-4">
            {myActivities.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="py-12 text-center">
                  <ActivityIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No activities yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Start contributing to see your activity here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                
                <div className="space-y-6">
                  {myActivities.map((activity) => (
                    <div key={activity._id} className="relative flex gap-4">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center z-10`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <Card className="flex-1 dark:bg-gray-800 dark:border-gray-700">
                        <CardContent className="p-4">
                          <p className="text-gray-900 dark:text-white font-medium">
                            {activity.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </p>
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                              {activity.metadata.points && (
                                <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                                  +{activity.metadata.points} points
                                </span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            {communityActivities.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No community activities yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                
                <div className="space-y-6">
                  {communityActivities.map((activity) => (
                    <div key={activity._id} className="relative flex gap-4">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center z-10`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <Card className="flex-1 dark:bg-gray-800 dark:border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {activity.user.username.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {activity.user.username}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {activity.user.country}
                                </span>
                                {activity.user.role !== 'contributor' && (
                                  <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded">
                                    {activity.user.role}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-900 dark:text-white">
                                {activity.description}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
