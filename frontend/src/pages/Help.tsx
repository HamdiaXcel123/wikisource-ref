import { useState } from 'react';
import { 
  HelpCircle, 
  Book, 
  Video, 
  MessageCircle, 
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  Shield,
  Award,
  Users,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: 'Getting Started',
    question: 'What is WikiSourceRef?',
    answer: 'WikiSourceRef is a community-driven platform that helps Wikipedia editors verify and maintain high-quality reference sources. It allows contributors to submit references for verification and enables country-based verifiers to review and validate sources.'
  },
  {
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking the "Register" button on the authentication page. You can register using your email or connect with your Wikimedia account for seamless integration with Wikipedia.'
  },
  {
    category: 'Submissions',
    question: 'What types of sources can I submit?',
    answer: 'You can submit various types of sources including articles, books, journals, websites, PDFs, videos, and podcasts. Each submission should include relevant metadata such as title, publisher, authors, and publication date.'
  },
  {
    category: 'Submissions',
    question: 'What are the different source categories?',
    answer: 'Sources are categorized as: Primary Sources (firsthand/original data), Secondary Sources (reporting or analysis), and Potentially Unreliable (questionable editorial standards). This helps verifiers assess the reliability of sources.'
  },
  {
    category: 'Submissions',
    question: 'How long does verification take?',
    answer: 'Verification time varies depending on the country and availability of verifiers. Most submissions are reviewed within 3-7 days. You will receive a notification once your submission has been verified.'
  },
  {
    category: 'Verification',
    question: 'How do I become a verifier?',
    answer: 'To become a verifier, you need to demonstrate consistent high-quality contributions and knowledge of reliable sources. Contact an administrator or apply through your profile settings once you have earned sufficient points and badges.'
  },
  {
    category: 'Verification',
    question: 'What criteria should I use when verifying sources?',
    answer: 'When verifying sources, consider: editorial standards, author credentials, publication reputation, fact-checking processes, bias and objectivity, and compliance with Wikipedia\'s reliable sources guidelines.'
  },
  {
    category: 'Points & Badges',
    question: 'How do I earn points?',
    answer: 'You earn points by: submitting references (+10 points), having references approved (+25 additional points), and verifying submissions as a verifier (+5 points). Points help you climb the leaderboard and unlock badges.'
  },
  {
    category: 'Points & Badges',
    question: 'What are badges and how do I earn them?',
    answer: 'Badges are achievements that recognize your contributions. They are awarded for reaching milestones such as number of submissions, approval rate, verification count, and community engagement. Check your profile to see available badges.'
  },
  {
    category: 'Account',
    question: 'How do I change my settings?',
    answer: 'Go to the Settings page from the navigation menu. There you can customize your theme, notification preferences, privacy settings, and account security options.'
  },
  {
    category: 'Account',
    question: 'Can I delete my account?',
    answer: 'Yes, you can delete your account from the Settings page under the "Danger Zone" section. Please note that this action is irreversible and will permanently delete all your data.'
  }
];

const guides = [
  {
    title: 'Getting Started Guide',
    description: 'Learn the basics of WikiSourceRef and how to make your first submission',
    icon: Book,
    link: '#'
  },
  {
    title: 'Verification Best Practices',
    description: 'Guidelines for verifiers on how to assess source reliability',
    icon: Shield,
    link: '#'
  },
  {
    title: 'Understanding Source Categories',
    description: 'Learn about primary, secondary, and unreliable source classifications',
    icon: FileText,
    link: '#'
  },
  {
    title: 'Points and Gamification',
    description: 'How the points system works and how to earn badges',
    icon: Award,
    link: '#'
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqsByCategory = filteredFAQs.reduce((acc, faq, index) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push({ ...faq, index });
    return acc;
  }, {} as Record<string, (FAQ & { index: number })[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8" />
            Help Center
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find answers, guides, and resources to help you get the most out of WikiSourceRef
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
            <TabsTrigger value="faq" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
              <Book className="h-4 w-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
              <ExternalLink className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {Object.keys(faqsByCategory).length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No FAQs found matching your search</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(faqsByCategory).map(([category, categoryFAQs]) => (
                <Card key={category} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categoryFAQs.map((faq) => (
                      <div key={faq.index} className="border dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.index ? null : faq.index)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                          {expandedFAQ === faq.index ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </button>
                        {expandedFAQ === faq.index && (
                          <div className="px-4 py-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide, index) => (
                <Card key={index} className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <guide.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="dark:text-white">{guide.title}</CardTitle>
                        <CardDescription className="dark:text-gray-400 mt-2">
                          {guide.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full dark:border-gray-700 dark:text-gray-300">
                      Read Guide
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Watch step-by-step video guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  Video tutorials coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Wikipedia Guidelines</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Official Wikipedia policies and guidelines for reliable sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://en.wikipedia.org/wiki/Wikipedia:Verifiability"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-gray-900 dark:text-white">Wikipedia Verifiability Policy</span>
                  <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-gray-900 dark:text-white">Reliable Sources Guidelines</span>
                  <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/Wikipedia:Identifying_reliable_sources"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-gray-900 dark:text-white">Identifying Reliable Sources</span>
                  <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </a>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Community Resources</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Connect with the community and get support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white">Community Forum</span>
                  </div>
                  <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300">
                    Visit
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-900 dark:text-white">Discord Server</span>
                  </div>
                  <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300">
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-400">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Can't find what you're looking for? Our support team is here to help!
                </p>
                <Button className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
