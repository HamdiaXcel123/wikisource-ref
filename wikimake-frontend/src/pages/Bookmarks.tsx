import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { 
  Bookmark as BookmarkIcon, 
  Trash2, 
  ExternalLink,
  FolderOpen,
  Plus,
  Edit,
  Tag
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Bookmark {
  _id: string;
  submission: {
    _id: string;
    title: string;
    publisher: string;
    url: string;
    category: string;
    status: string;
    country: string;
    submitter: {
      username: string;
      country: string;
    };
  };
  notes?: string;
  tags: string[];
  folder: string;
  createdAt: string;
}

export default function Bookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editFolder, setEditFolder] = useState('default');

  useEffect(() => {
    fetchBookmarks();
  }, [selectedFolder]);

  const fetchBookmarks = async () => {
    try {
      const query = selectedFolder !== 'all' ? `?folder=${selectedFolder}` : '';
      const response = await api.get(`/bookmarks${query}`);
      setBookmarks(response.bookmarks);
      setFolders(response.folders || ['default']);
    } catch (error) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const deleteBookmark = async (id: string) => {
    if (!confirm('Are you sure you want to remove this bookmark?')) return;

    try {
      await api.delete(`/bookmarks/${id}`);
      setBookmarks(bookmarks.filter(b => b._id !== id));
      toast.success('Bookmark removed');
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  const openEditDialog = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setEditNotes(bookmark.notes || '');
    setEditTags(bookmark.tags.join(', '));
    setEditFolder(bookmark.folder);
  };

  const saveBookmark = async () => {
    if (!editingBookmark) return;

    try {
      const response = await api.put(`/bookmarks/${editingBookmark._id}`, {
        notes: editNotes,
        tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
        folder: editFolder
      });

      setBookmarks(bookmarks.map(b => 
        b._id === editingBookmark._id ? response.bookmark : b
      ));
      setEditingBookmark(null);
      toast.success('Bookmark updated');
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      primary: { label: '📗 Primary', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      secondary: { label: '📘 Secondary', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      unreliable: { label: '🚫 Unreliable', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    };
    return badges[category as keyof typeof badges] || badges.secondary;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: { label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookmarkIcon className="h-8 w-8" />
                My Bookmarks
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Save and organize your favorite references
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-48 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder} value={folder}>
                      {folder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-12 text-center">
              <BookmarkIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {selectedFolder !== 'all' 
                  ? `No bookmarks in "${selectedFolder}" folder`
                  : 'No bookmarks yet'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Browse the directory and bookmark references you want to save
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookmarks.map((bookmark) => {
              const categoryBadge = getCategoryBadge(bookmark.submission.category);
              const statusBadge = getStatusBadge(bookmark.submission.status);

              return (
                <Card key={bookmark._id} className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="dark:text-white flex items-start gap-2">
                          <BookmarkIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                          <span>{bookmark.submission.title}</span>
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400 mt-2">
                          {bookmark.submission.publisher}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(bookmark)}
                              className="dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="dark:text-white">Edit Bookmark</DialogTitle>
                              <DialogDescription className="dark:text-gray-400">
                                Update your bookmark notes, tags, and folder
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <Label className="dark:text-gray-300">Notes</Label>
                                <Textarea
                                  value={editNotes}
                                  onChange={(e) => setEditNotes(e.target.value)}
                                  placeholder="Add personal notes about this reference..."
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="dark:text-gray-300">Tags (comma-separated)</Label>
                                <Input
                                  value={editTags}
                                  onChange={(e) => setEditTags(e.target.value)}
                                  placeholder="research, important, review"
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="dark:text-gray-300">Folder</Label>
                                <Input
                                  value={editFolder}
                                  onChange={(e) => setEditFolder(e.target.value)}
                                  placeholder="default"
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                />
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button onClick={saveBookmark} className="flex-1">
                                  Save Changes
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setEditingBookmark(null)}
                                  className="dark:border-gray-700 dark:text-gray-300"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteBookmark(bookmark._id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${categoryBadge.color}`}>
                        {categoryBadge.label}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        📍 {bookmark.submission.country}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        📁 {bookmark.folder}
                      </span>
                    </div>

                    {bookmark.notes && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Notes:</strong> {bookmark.notes}
                        </p>
                      </div>
                    )}

                    {bookmark.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        {bookmark.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Submitted by <span className="font-medium">{bookmark.submission.submitter.username}</span>
                      </div>
                      <a
                        href={bookmark.submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm flex items-center gap-1"
                      >
                        View Source
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
