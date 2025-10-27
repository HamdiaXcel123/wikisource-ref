import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  Award,
  Globe,
  Activity as ActivityIcon,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Stats {
  user: {
    submissions: number;
    approved: number;
    pending: number;
    points: number;
    badges: number;
    recentActivity: number;
  };
  global?: {
    totalSubmissions: number;
    pendingVerification: number;
    totalUsers: number;
    totalVerifiers: number;
  };
}

interface CountryStat {
  _id: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [countryStats, setCountryStats] = useState<CountryStat[]>([]);
  const [categoryDist, setCategoryDist] = useState<any[]>([]);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const [statsRes, trendsRes, countriesRes, categoriesRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get(`/analytics/trends?period=${period}`),
        api.get('/analytics/countries'),
        api.get('/analytics/categories')
      ]);

      setStats(statsRes.stats);
      setTrends(trendsRes.trends);
      setCountryStats(countriesRes.countryStats);
      setCategoryDist(categoriesRes.distribution);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const approvalRate = stats.user.submissions > 0 
    ? ((stats.user.approved / stats.user.submissions) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track your contributions and community statistics
              </p>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Submissions
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.user.submissions}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.user.pending} pending review
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Approved
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.user.approved}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {approvalRate}% approval rate
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Points Earned
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.user.points}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Rank in community
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Badges
              </CardTitle>
              <Award className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.user.badges}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Achievements unlocked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Global Stats (for verifiers/admins) */}
        {stats.global && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700 border-blue-200 dark:border-blue-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Submissions
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stats.global.totalSubmissions}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Community-wide</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700 border-orange-200 dark:border-orange-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Verification
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stats.global.pendingVerification}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting review</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700 border-green-200 dark:border-green-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stats.global.totalUsers}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contributors</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700 border-purple-200 dark:border-purple-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Verifiers
                </CardTitle>
                <Award className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stats.global.totalVerifiers}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active verifiers</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <TabsTrigger value="trends" className="dark:data-[state=active]:bg-gray-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="countries" className="dark:data-[state=active]:bg-gray-700">
              <Globe className="h-4 w-4 mr-2" />
              By Country
            </TabsTrigger>
            <TabsTrigger value="categories" className="dark:data-[state=active]:bg-gray-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Submission Trends</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Daily submission activity over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trends.length > 0 ? (
                  <div className="space-y-4">
                    <div className="h-64 flex items-end justify-between gap-2">
                      {trends.slice(0, 30).map((trend, idx) => {
                        const maxCount = Math.max(...trends.map(t => t.count));
                        const height = (trend.count / maxCount) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <div 
                              className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors"
                              style={{ height: `${height}%` }}
                              title={`${trend._id.date}: ${trend.count} submissions`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Showing last {Math.min(trends.length, 30)} days
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No data available for this period
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="countries" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Top Countries</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Submission statistics by country
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryStats.map((country, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium dark:text-white">{country._id}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {country.total} total
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded px-2 py-1 text-center">
                          <span className="text-green-700 dark:text-green-400">
                            {country.approved} approved
                          </span>
                        </div>
                        <div className="flex-1 bg-yellow-100 dark:bg-yellow-900/30 rounded px-2 py-1 text-center">
                          <span className="text-yellow-700 dark:text-yellow-400">
                            {country.pending} pending
                          </span>
                        </div>
                        <div className="flex-1 bg-red-100 dark:bg-red-900/30 rounded px-2 py-1 text-center">
                          <span className="text-red-700 dark:text-red-400">
                            {country.rejected} rejected
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Category Distribution</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Breakdown of submissions by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryDist.map((cat, idx) => {
                    const total = categoryDist.reduce((sum, c) => sum + c.count, 0);
                    const percentage = ((cat.count / total) * 100).toFixed(1);
                    
                    const categoryLabels: Record<string, string> = {
                      primary: '📗 Primary Source',
                      secondary: '📘 Secondary Source',
                      unreliable: '🚫 Potentially Unreliable'
                    };

                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium dark:text-white">
                            {categoryLabels[cat._id] || cat._id}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {cat.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              cat._id === 'primary' ? 'bg-green-600' :
                              cat._id === 'secondary' ? 'bg-blue-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity Summary */}
        <Card className="mt-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white flex items-center gap-2">
              <ActivityIcon className="h-5 w-5" />
              Recent Activity Summary
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Your activity in the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold dark:text-white">{stats.user.recentActivity}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Actions</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold dark:text-white">{stats.user.pending}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold dark:text-white">{stats.user.badges}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
