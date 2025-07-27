import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, LogOut, User, Settings, Menu, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import NoteCard from './NoteCard';
import CreateNoteModal from './CreateNoteModal';
import WelcomeSection from './WelcomeSection';
import ThemeToggle from './ThemeToggle';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch notes when debounced search term changes
  useEffect(() => {
    fetchNotes(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Fetch total notes count separately for welcome section
  useEffect(() => {
    if (!debouncedSearchTerm) {
      fetchTotalNotesCount();
    }
  }, [debouncedSearchTerm]);

  const fetchTotalNotesCount = async () => {
    try {
      const response = await notesAPI.getNotes();
      setTotalNotes(response.data.notes?.length || 0);
    } catch (error) {
      console.error('Error fetching total notes count:', error);
    }
  };

  const fetchNotes = async (search = '') => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) {
        params.search = search.trim();
      }
      const response = await notesAPI.getNotes(params);
      setNotes(response.data.notes || []);

      // Update total notes count if not searching
      if (!search.trim()) {
        setTotalNotes(response.data.notes?.length || 0);
      }
    } catch (error) {
      toast.error('Failed to fetch notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const response = await notesAPI.createNote(noteData);
      // Refresh the notes list to ensure search results are updated
      await fetchNotes(debouncedSearchTerm);
      // Update total count if not searching
      if (!debouncedSearchTerm) {
        await fetchTotalNotesCount();
      }
      setShowCreateModal(false);
      toast.success('Note created successfully!');
    } catch (error) {
      toast.error('Failed to create note');
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const response = await notesAPI.updateNote(id, noteData);
      // Refresh the notes list to ensure search results are updated
      await fetchNotes(debouncedSearchTerm);
      toast.success('Note updated successfully!');
    } catch (error) {
      toast.error('Failed to update note');
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await notesAPI.deleteNote(id);
      // Refresh the notes list to ensure search results are updated
      await fetchNotes(debouncedSearchTerm);
      // Update total count if not searching
      if (!debouncedSearchTerm) {
        await fetchTotalNotesCount();
      }
      toast.success('Note deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Error deleting note:', error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  // Remove client-side filtering since we're now using server-side search
  const displayNotes = notes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">MindPad</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
              >
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name}</span>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                icon={LogOut}
              >
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2 justify-between items-center">
                <ThemeToggle />
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profile')}
                  >
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user?.name}</span>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    icon={LogOut}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <WelcomeSection user={user} notesCount={totalNotes} />

        {/* Search and Create Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="w-full sm:w-96">
            <Input
              type="text"
              placeholder="Search notes..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={Plus}
            className="w-full sm:w-auto"
          >
            Create Note
          </Button>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {debouncedSearchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {debouncedSearchTerm
                ? 'Try adjusting your search terms'
                : 'Create your first note to get started'
              }
            </p>
            {!debouncedSearchTerm && (
              <Button
                onClick={() => setShowCreateModal(true)}
                icon={Plus}
              >
                Create Your First Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateNote}
      />
    </div>
  );
};

export default Dashboard;
