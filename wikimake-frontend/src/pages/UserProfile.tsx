import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../lib/auth-context';
import {
  getCountryFlag,
  getCountryName,
  getCategoryIcon,
  getCategoryColor,
  getStatusColor,
} from '../lib/constants';
import { submissionApi } from '../lib/api';
import { toast } from 'sonner';
import { Award, TrendingUp, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubmissions();
    }
  }, [user]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const response = await submissionApi.getMy();
      if (response.success) {
        setSubmissions(response.submissions || []);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
      toast.error('Failed to load your submissions');
    } finally {
      setLoading(false);
    }
  };

  const userStats = useMemo(() => {
    if (!user) return null;

    const totalSubmissions = submissions.length;
    const verified = submissions.filter((s) => s.status === 'approved').length;
    const pending = submissions.filter((s) => s.status === 'pending').length;
    const rejected = submissions.filter((s) => s.status === 'rejected').length;
    const credible = verified; // All approved submissions are credible

    const verificationRate =
      totalSubmissions > 0 ? Math.round((verified / totalSubmissions) * 100) : 0;
    const successRate =
      verified > 0 ? Math.round((credible / verified) * 100) : 0;

    return {
      totalSubmissions,
      verified,
      pending,
      rejected,
      credible,
      verificationRate,
      successRate,
      submissions,
    };
  }, [user, submissions]);

  const userBadges = useMemo(() => {
    if (!user) return [];
    // User badges from API are already complete badge objects
    return user.badges;
  }, [user]);


  const nextMilestone = useMemo(() => {
    if (!user) return null;

    const milestones = [
      { points: 100, name: 'Contributor', icon: '🌟' },
      { points: 250, name: 'Regular Contributor', icon: '⭐' },
      { points: 500, name: 'Expert Contributor', icon: '💎' },
      { points: 1000, name: 'Elite Contributor', icon: '🏆' },
    ];

    const next = milestones.find((m) => m.points > user.points);
    if (!next) return null;

    const progress = (user.points / next.points) * 100;
    return { ...next, progress };
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">Track your contributions and achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">{getCountryFlag(user.country)}</span>
            </div>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Role</span>
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Country</span>
              <span className="dark:text-gray-300">{getCountryName(user.country)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Member Since</span>
              <span className="dark:text-gray-300">{user.joinDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Points</span>
              <Badge variant="default" className="text-lg px-4">
                {user.points}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Submissions</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{userStats?.totalSubmissions || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-600">{userStats?.verified || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-yellow-600">{userStats?.pending || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Credible</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-600">{userStats?.credible || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-purple-600">{userStats?.successRate || 0}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Badges</CardTitle>
                <Award className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-amber-600">{user.badges.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Next Milestone: {nextMilestone.name}</span>
              <span>{nextMilestone.icon}</span>
            </CardTitle>
            <CardDescription>
              {user.points} / {nextMilestone.points} points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={nextMilestone.progress} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {nextMilestone.points - user.points} points to go!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Badges and Submissions */}
      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6">
          {/* Unlocked Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Unlocked Badges ({userBadges.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBadges.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No badges yet. Keep contributing to earn badges!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userBadges.map((badge, index) => (
                    <Card key={index} className="bg-gradient-to-br from-amber-50 to-yellow-50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-5xl mb-3">{badge.icon}</div>
                          <h4 className="mb-1">{badge.name}</h4>
                          <p className="text-sm text-gray-600">
                            Earned {new Date(badge.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>My Submissions</CardTitle>
              <CardDescription>
                All references you've submitted for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading submissions...</p>
                </div>
              ) : userStats?.submissions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No submissions yet</p>
                  <button
                    onClick={() => navigate('/submit')}
                    className="text-blue-600 hover:underline"
                  >
                    Submit your first reference
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userStats?.submissions.map((submission) => (
                    <Card key={submission.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{getCategoryIcon(submission.category)}</span>
                          <div className="flex-1">
                            <h4 className="mb-1">{submission.title}</h4>
                            <p className="text-gray-600 mb-2">{submission.publisher}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className={getCategoryColor(submission.category)}
                              >
                                {submission.category}
                              </Badge>
                              {submission.status === 'approved' && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 border-green-300"
                                >
                                  ✅ Approved
                                </Badge>
                              )}
                              {submission.status === 'rejected' && (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 border-red-300"
                                >
                                  ❌ Rejected
                                </Badge>
                              )}
                              {submission.status === 'pending' && (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-800 border-yellow-300"
                                >
                                  ⏳ Pending
                                </Badge>
                              )}
                              <Badge variant="outline">
                                {getCountryFlag(submission.country)} {submission.country}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>Submitted {new Date(submission.createdAt).toLocaleDateString()}</span>
                              {submission.verifiedAt && (
                                <>
                                  <span>•</span>
                                  <span>Verified {new Date(submission.verifiedAt).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                            {submission.verifierNotes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm">
                                  <strong>Verifier Notes:</strong> {submission.verifierNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
