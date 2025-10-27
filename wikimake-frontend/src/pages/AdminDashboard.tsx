import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { useAuth } from '../lib/auth-context';
import {
  getCategoryIcon,
  getCategoryColor,
  getCountryFlag,
  getCountryName,
  getStatusColor,
} from '../lib/constants';
import { submissionApi } from '../lib/api';
import { toast } from 'sonner';

interface Submission {
  id: string;
  url: string;
  title: string;
  publisher: string;
  country: string;
  category: string;
  status: string;
  submitter?: any;
  verifier?: any;
  wikipediaArticle?: string;
  verifierNotes?: string;
  verifiedAt?: string;
  fileType?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
}
import { CheckCircle, XCircle, Eye, Clock, TrendingUp, Users, FileCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [statusChangeSubmission, setStatusChangeSubmission] = useState<Submission | null>(null);
  const [statusChangeNotes, setStatusChangeNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, [user]);

  const loadSubmissions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (user.role === 'verifier' || user.role === 'admin') {
        // Load all submissions for admin, or country-specific for verifier
        const params: any = { limit: 100 };
        if (user.role === 'verifier') {
          params.country = user.country;
        }
        
        const response = await submissionApi.getAll(params);
        if (response.success) {
          setSubmissions(response.submissions);
        }
      }
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (submission: Submission, status: 'approved' | 'rejected') => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await submissionApi.verify(
        submission.id,
        status,
        verificationNotes || undefined
      );

      if (response.success) {
        toast.success(
          `Reference ${status === 'approved' ? '✅ Approved' : '❌ Rejected'} (+5 points)`
        );
        
        // Update user points locally
        if (user) {
          user.points += 5;
        }
        
        // Reload submissions
        await loadSubmissions();
      }
    } catch (error) {
      toast.error('Failed to verify submission');
    } finally {
      setLoading(false);
      setSelectedSubmission(null);
      setVerificationNotes('');
      setShowDialog(false);
    }
  };

  const handleReject = async (submission: Submission) => {
    await handleVerify(submission, 'rejected');
  };

  const handleStatusChange = async (submission: Submission, newStatus: 'approved' | 'rejected') => {
    if (!user || user.role !== 'admin') {
      toast.error('Only admins can change submission status');
      return;
    }

    setLoading(true);
    try {
      const response = await submissionApi.verify(
        submission.id,
        newStatus,
        statusChangeNotes || undefined
      );

      if (response.success) {
        toast.success(
          `Status changed to ${newStatus === 'approved' ? '✅ Approved' : '❌ Rejected'}`
        );
        
        // Reload submissions
        await loadSubmissions();
      }
    } catch (error) {
      toast.error('Failed to change submission status');
    } finally {
      setLoading(false);
      setStatusChangeSubmission(null);
      setStatusChangeNotes('');
      setShowStatusChangeDialog(false);
    }
  };

  const openStatusChangeDialog = (submission: Submission) => {
    setStatusChangeSubmission(submission);
    setStatusChangeNotes(submission.verifierNotes || '');
    setShowStatusChangeDialog(true);
  };

  const openVerificationDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setVerificationNotes('');
    setShowDialog(true);
  };

  const getPendingSubmissions = () => {
    return submissions.filter((s) => s.status === 'pending');
  };

  const getApprovedSubmissions = () => {
    let filtered = submissions.filter((s) => s.status === 'approved');

    if (filterCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === filterCategory);
    }

    if (filterDate === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter((s: any) => {
        const verifiedDate = s.verifiedAt ? new Date(s.verifiedAt).toISOString().split('T')[0] : null;
        return verifiedDate === today;
      });
    } else if (filterDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      filtered = filtered.filter((s: any) => {
        const verifiedDate = s.verifiedAt ? new Date(s.verifiedAt).toISOString().split('T')[0] : null;
        return verifiedDate && verifiedDate >= weekAgoStr;
      });
    }

    return filtered;
  };

  const getRejectedSubmissions = () => {
    let filtered = submissions.filter((s) => s.status === 'rejected');

    if (filterCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === filterCategory);
    }

    if (filterDate === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter((s: any) => {
        const verifiedDate = s.verifiedAt ? new Date(s.verifiedAt).toISOString().split('T')[0] : null;
        return verifiedDate === today;
      });
    } else if (filterDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      filtered = filtered.filter((s: any) => {
        const verifiedDate = s.verifiedAt ? new Date(s.verifiedAt).toISOString().split('T')[0] : null;
        return verifiedDate && verifiedDate >= weekAgoStr;
      });
    }

    return filtered;
  };


  if (!user || (user.role !== 'admin' && user.role !== 'verifier')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need admin or verifier privileges to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingSubmissions = getPendingSubmissions();
  const approvedSubmissions = getApprovedSubmissions();
  const rejectedSubmissions = getRejectedSubmissions();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 dark:text-white">Verification Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Review and verify reference submissions from the community
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            Pending ({pendingSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approved ({approvedSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <XCircle className="h-4 w-4 mr-2" />
            Rejected ({rejectedSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg mb-2">No pending submissions</p>
                <p className="text-gray-500">All caught up! Great work.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.map((submission: any) => (
                <Card key={submission.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3 mb-3">
                          <span className="text-2xl">{getCategoryIcon(submission.category)}</span>
                          <div className="flex-1">
                            <h3 className="mb-1">{submission.title}</h3>
                            <p className="text-gray-600 mb-2">{submission.publisher}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline" className={getCategoryColor(submission.category)}>
                                {submission.category}
                              </Badge>
                              <Badge variant="outline">
                                {getCountryFlag(submission.country)} {getCountryName(submission.country)}
                              </Badge>
                              <Badge variant="outline">
                                {submission.fileType === 'pdf' ? '📄 PDF' : '🔗 URL'}
                              </Badge>
                            </div>
                            <a
                              href={submission.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline block mb-2"
                            >
                              {submission.url}
                            </a>
                            {submission.wikipediaArticle && (
                              <a
                                href={submission.wikipediaArticle}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-500 hover:underline block"
                              >
                                📖 Wikipedia Article
                              </a>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                              Submitted by {submission.submitter?.username || 'Unknown'} on {new Date(submission.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 min-w-[160px]">
                        <Button
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => openVerificationDialog(submission)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(submission.url, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Source
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          <div className="flex gap-4 mb-4">
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="primary">📗 Primary</SelectItem>
                <SelectItem value="secondary">📘 Secondary</SelectItem>
                <SelectItem value="unreliable">🚫 Unreliable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {approvedSubmissions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg mb-2">No approved submissions</p>
                  <p className="text-gray-500">Approved submissions will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              approvedSubmissions.map((submission: any) => (
              <Card key={submission.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-2xl">{getCategoryIcon(submission.category)}</span>
                      <div className="flex-1">
                        <h3 className="mb-1">{submission.title}</h3>
                        <p className="text-gray-600 mb-2">{submission.publisher}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className={getCategoryColor(submission.category)}>
                            {submission.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-300"
                          >
                            ✅ Approved
                          </Badge>
                          <Badge variant="outline">
                            {getCountryFlag(submission.country)} {getCountryName(submission.country)}
                          </Badge>
                        </div>
                        <a
                          href={submission.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline block mb-2"
                        >
                          {submission.url}
                        </a>
                        {submission.verifierNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm">
                              <strong>Verification Notes:</strong> {submission.verifierNotes}
                            </p>
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          Verified on {submission.verifiedAt ? new Date(submission.verifiedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <div className="flex flex-col space-y-2 min-w-[140px]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openStatusChangeDialog(submission)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Change to Rejected
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="flex gap-4 mb-4">
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="primary">📗 Primary</SelectItem>
                <SelectItem value="secondary">📘 Secondary</SelectItem>
                <SelectItem value="unreliable">🚫 Unreliable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {rejectedSubmissions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg mb-2">No rejected submissions</p>
                  <p className="text-gray-500">Rejected submissions will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              rejectedSubmissions.map((submission: any) => (
                <Card key={submission.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-2xl">{getCategoryIcon(submission.category)}</span>
                        <div className="flex-1">
                          <h3 className="mb-1">{submission.title}</h3>
                          <p className="text-gray-600 mb-2">{submission.publisher}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className={getCategoryColor(submission.category)}>
                              {submission.category}
                            </Badge>
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                              ❌ Rejected
                            </Badge>
                            <Badge variant="outline">
                              {getCountryFlag(submission.country)} {getCountryName(submission.country)}
                            </Badge>
                          </div>
                          <a
                            href={submission.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline block mb-2"
                          >
                            {submission.url}
                          </a>
                          {submission.verifierNotes && (
                            <div className="mt-3 p-3 bg-red-50 rounded-md border border-red-200">
                              <p className="text-sm">
                                <strong>Rejection Reason:</strong> {submission.verifierNotes}
                              </p>
                            </div>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            Rejected on {submission.verifiedAt ? new Date(submission.verifiedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {user?.role === 'admin' && (
                        <div className="flex flex-col space-y-2 min-w-[140px]">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStatusChangeDialog(submission)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Change to Approved
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Status Change Dialog */}
      <Dialog open={showStatusChangeDialog} onOpenChange={setShowStatusChangeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Submission Status</DialogTitle>
            <DialogDescription>
              Update the status of this submission
            </DialogDescription>
          </DialogHeader>

          {statusChangeSubmission && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">{statusChangeSubmission.title}</h4>
                <p className="text-gray-600 mb-2">{statusChangeSubmission.publisher}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className={getCategoryColor(statusChangeSubmission.category)}>
                    {getCategoryIcon(statusChangeSubmission.category)} {statusChangeSubmission.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      statusChangeSubmission.status === 'approved'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-red-100 text-red-800 border-red-300'
                    }
                  >
                    {statusChangeSubmission.status === 'approved' ? '✅ Currently Approved' : '❌ Currently Rejected'}
                  </Badge>
                  <Badge variant="outline">
                    {getCountryFlag(statusChangeSubmission.country)}{' '}
                    {getCountryName(statusChangeSubmission.country)}
                  </Badge>
                </div>
                <a
                  href={statusChangeSubmission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {statusChangeSubmission.url}
                </a>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Update Notes (Optional)</label>
                <Textarea
                  placeholder="Add or update notes about this status change..."
                  value={statusChangeNotes}
                  onChange={(e) => setStatusChangeNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowStatusChangeDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            {statusChangeSubmission?.status === 'approved' ? (
              <Button
                variant="destructive"
                onClick={() => statusChangeSubmission && handleStatusChange(statusChangeSubmission, 'rejected')}
                className="w-full sm:w-auto"
                disabled={loading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Change to Rejected
              </Button>
            ) : (
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                onClick={() => statusChangeSubmission && handleStatusChange(statusChangeSubmission, 'approved')}
                disabled={loading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Change to Approved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verify Reference</DialogTitle>
            <DialogDescription>
              Review this submission and mark it as credible or unreliable
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">{selectedSubmission.title}</h4>
                <p className="text-gray-600 mb-2">{selectedSubmission.publisher}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className={getCategoryColor(selectedSubmission.category)}>
                    {getCategoryIcon(selectedSubmission.category)} {selectedSubmission.category}
                  </Badge>
                  <Badge variant="outline">
                    {getCountryFlag(selectedSubmission.country)}{' '}
                    {getCountryName(selectedSubmission.country)}
                  </Badge>
                </div>
                <a
                  href={selectedSubmission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {selectedSubmission.url}
                </a>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Verification Notes (Optional)</label>
                <Textarea
                  placeholder="Add notes about editorial standards, bias, verification status, etc."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => selectedSubmission && handleReject(selectedSubmission)}
              className="w-full sm:w-auto"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedSubmission && handleVerify(selectedSubmission, 'rejected')}
              className="w-full sm:w-auto"
            >
              ❌ Mark Unreliable
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              onClick={() => selectedSubmission && handleVerify(selectedSubmission, 'approved')}
            >
              ✅ Mark Credible
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
