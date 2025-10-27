import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { 
  LandingPage, 
  AuthPage, 
  SubmissionForm, 
  AdminDashboard, 
  PublicDirectory, 
  UserProfile,
  Settings,
  Analytics,
  Notifications,
  ActivityFeed,
  Help,
  Bookmarks
} from './pages';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-white transition-colors">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/submit" element={
              <ProtectedRoute excludeAdmin>
                <SubmissionForm />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireVerifier>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/directory" element={<PublicDirectory />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/activity" element={
              <ProtectedRoute>
                <ActivityFeed />
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            } />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
        
        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="mb-3">About WikiSourceRef</h3>
                <p className="text-sm text-gray-600">
                  A community-driven platform for verifying Wikipedia references and maintaining
                  source quality standards.
                </p>
              </div>
              <div>
                <h3 className="mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/directory" className="text-gray-600 hover:text-gray-900">
                      Browse Directory
                    </a>
                  </li>
                  <li>
                    <a href="/auth" className="text-gray-600 hover:text-gray-900">
                      Login / Register
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="https://en.wikipedia.org/wiki/Wikipedia:Verifiability" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Wikipedia Verifiability Guidelines
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Reliable Sources Policy
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://en.wikipedia.org/wiki/Wikipedia:Community" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Community Guidelines
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.mediawiki.org/wiki/API:Main_page" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      API Documentation
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
              <p>© 2025 WikiSourceRef. Built for the Wikipedia community.</p>
              <p className="mt-2">
                This is a demonstration platform. For production use, connect to a real backend
                service.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
