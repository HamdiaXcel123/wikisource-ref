import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useAuth } from '../lib/auth-context';
import { COUNTRIES } from '../lib/constants';
import { submissionApi } from '../lib/api';
import { toast } from 'sonner';
import { Upload, Link2, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export const SubmissionForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [submissionType, setSubmissionType] = useState<'url' | 'pdf'>('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState<'primary' | 'secondary' | 'unreliable'>('secondary');
  const [wikipediaArticle, setWikipediaArticle] = useState('');
  const [fileName, setFileName] = useState('');
  const [doi, setDoi] = useState('');
  const [mediaType, setMediaType] = useState('article');
  const [authors, setAuthors] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      setFileName(file.name);
    }
  };

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to submit references');
      navigate('/auth');
      return;
    }

    // Validation
    if (!title.trim()) {
      toast.error('Please enter a title for the reference');
      return;
    }

    if (!publisher.trim()) {
      toast.error('Please enter the publisher name');
      return;
    }

    if (submissionType === 'url') {
      if (!url.trim()) {
        toast.error('Please enter a URL');
        return;
      }
      if (!validateUrl(url)) {
        toast.error('Please enter a valid URL (must start with http:// or https://)');
        return;
      }
    }

    if (submissionType === 'pdf' && !fileName) {
      toast.error('Please upload a PDF file');
      return;
    }

    if (!country) {
      toast.error('Please select a country for this reference');
      return;
    }

    setLoading(true);

    try {
      const authorsArray = authors.split(',').map(a => a.trim()).filter(a => a);
      
      const response = await submissionApi.create({
        url: submissionType === 'url' ? url : `https://uploads.wikisource.org/${fileName}`,
        title,
        publisher,
        country,
        category,
        wikipediaArticle: wikipediaArticle || undefined,
        fileType: submissionType,
        fileName: submissionType === 'pdf' ? fileName : undefined,
        doi: doi || undefined,
        mediaType,
        authors: authorsArray.length > 0 ? authorsArray : undefined,
        publicationDate: publicationDate || undefined,
      });

      if (response.success) {
        toast.success('Reference submitted successfully! (+10 points)');
        
        // Update user points locally
        updateUser({ points: user.points + 10 });
      }

      // Reset form
      setUrl('');
      setTitle('');
      setPublisher('');
      setCountry('');
      setCategory('secondary');
      setWikipediaArticle('');
      setFileName('');
      setDoi('');
      setMediaType('article');
      setAuthors('');
      setPublicationDate('');

      // Navigate to directory
      setTimeout(() => navigate('/directory'), 1500);
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Submission failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to submit references for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 dark:text-white">Submit Reference for Verification</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Help improve Wikipedia's source quality by submitting references for community review.
        </p>
      </div>

      {/* User Info Alert */}
      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Submitting as <strong>{user.username}</strong> ({user.country}) • You'll earn 10 points for each submission
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Reference Details</CardTitle>
          <CardDescription>
            All fields marked with * are required
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submission Type */}
            <div className="space-y-2">
              <Label>Submission Type *</Label>
              <RadioGroup
                value={submissionType}
                onValueChange={(value: string) => setSubmissionType(value as 'url' | 'pdf')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="type-url" />
                  <Label htmlFor="type-url" className="cursor-pointer flex items-center space-x-2">
                    <Link2 className="h-4 w-4" />
                    <span>URL</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="type-pdf" />
                  <Label htmlFor="type-pdf" className="cursor-pointer flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF Upload</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* URL or File Upload */}
            {submissionType === 'url' ? (
              <div className="space-y-2">
                <Label htmlFor="url">Source URL *</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Enter the complete URL of the reference source
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="file">Upload PDF File (Max 10MB) *</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {fileName && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>{fileName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Reference Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Article or document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Publisher */}
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher/Source *</Label>
              <Input
                id="publisher"
                type="text"
                placeholder="e.g., Nature, BBC, arXiv"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                required
              />
            </div>

            {/* DOI (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="doi">DOI (Optional)</Label>
              <Input
                id="doi"
                type="text"
                placeholder="10.1000/xyz123"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Digital Object Identifier for academic papers
              </p>
            </div>

            {/* Media Type */}
            <div className="space-y-2">
              <Label htmlFor="mediaType">Media Type</Label>
              <Select value={mediaType} onValueChange={setMediaType}>
                <SelectTrigger id="mediaType">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="journal">Journal</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Authors (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="authors">Authors (Optional)</Label>
              <Input
                id="authors"
                type="text"
                placeholder="John Doe, Jane Smith"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Separate multiple authors with commas
              </p>
            </div>

            {/* Publication Date (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="publicationDate">Publication Date (Optional)</Label>
              <Input
                id="publicationDate"
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country of Origin *</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Country-based verifiers will review this submission
              </p>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <Label>Source Category *</Label>
              <RadioGroup
                value={category}
                onValueChange={(value: string) => setCategory(value as 'primary' | 'secondary' | 'unreliable')}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="primary" id="cat-primary" className="mt-1" />
                  <Label htmlFor="cat-primary" className="cursor-pointer flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">ðŸ“—</span>
                      <span>Primary Source</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Original research, historical documents, raw data
                    </p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="secondary" id="cat-secondary" className="mt-1" />
                  <Label htmlFor="cat-secondary" className="cursor-pointer flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">ðŸ“˜</span>
                      <span>Secondary Source</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Analysis, commentary, scholarly reviews
                    </p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="unreliable" id="cat-unreliable" className="mt-1" />
                  <Label htmlFor="cat-unreliable" className="cursor-pointer flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">ðŸš«</span>
                      <span>Potentially Unreliable</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Questionable editorial standards, unverified claims
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Wikipedia Article (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="wikipedia">Wikipedia Article URL (Optional)</Label>
              <Input
                id="wikipedia"
                type="url"
                placeholder="https://en.wikipedia.org/wiki/Article_name"
                value={wikipediaArticle}
                onChange={(e) => setWikipediaArticle(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Link to the Wikipedia article where this source is used
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                By submitting, you confirm this reference meets Wikipedia's verifiability standards.
                Submissions will be reviewed by country verifiers.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-pulse" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Reference
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/directory')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
