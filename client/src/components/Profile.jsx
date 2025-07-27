import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Trash2, Edit3, Save, X, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEditForm = () => {
    const errors = {};
    
    if (!editForm.name.trim()) {
      errors.name = 'Name is required';
    } else if (editForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email is no longer editable, so no need to validate it

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateEditForm()) return;

    setLoading(true);
    try {
      // Only send name, not email
      const response = await authAPI.updateProfile({ name: editForm.name });
      updateUser(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.path] = err.msg;
        });
        setFormErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      await authAPI.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePasswordModal(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting to delete account...');
      await authAPI.deleteAccount();
      console.log('Account deletion API call successful');
      
      // Clear auth state
      logout();
      toast.success('Account deleted successfully');
      navigate('/login');
    } catch (error) {
      console.error('Delete account error:', error);
      console.error('Error response:', error.response);
      
      const message = error.response?.data?.message || 'Failed to delete account';
      const statusCode = error.response?.status;
      
      if (statusCode === 401) {
        toast.error('Authentication failed. Please log in again.');
        logout();
        navigate('/login');
      } else if (statusCode === 404) {
        toast.error('Account not found');
      } else {
        toast.error(`${message} (Status: ${statusCode || 'Unknown'})`);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back button - positioned at extreme left */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              icon={ArrowLeft}
            >
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
            
            {/* Centered heading */}
            <h1 className="text-xl font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2">Profile Settings</h1>
            
            {/* Empty div for balance */}
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    icon={Edit3}
                    className="self-start sm:self-auto"
                  >
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    value={editForm.name}
                    onChange={handleEditChange}
                    error={formErrors.name}
                    icon={User}
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    error={formErrors.email}
                    icon={Mail}
                    disabled={true}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email address cannot be changed for security reasons
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      loading={loading}
                      icon={Save}
                      className="w-full sm:w-auto"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ name: user?.name || '', email: user?.email || '' });
                        setFormErrors({});
                      }}
                      icon={X}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xl sm:text-2xl">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900">{user?.name}</h3>
                      <p className="text-gray-500 text-sm sm:text-base">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex items-center space-x-3 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-gray-900 text-sm sm:text-base truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                      <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700">Login Method</p>
                        <p className="text-gray-900 text-sm sm:text-base capitalize">{user?.loginMethod}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                      <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700">Member Since</p>
                        <p className="text-gray-900 text-sm sm:text-base">{formatDate(user?.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                      <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700">Last Updated</p>
                        <p className="text-gray-900 text-sm sm:text-base">{formatDate(user?.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Security Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
              <div className="space-y-3">
                {user?.loginMethod === 'email' && (
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => setShowChangePasswordModal(true)}
                    icon={Lock}
                  >
                    <span className="sm:hidden">Change Password</span>
                    <span className="hidden sm:inline">Change Password</span>
                  </Button>
                )}
                <div className="flex items-center space-x-2 p-2 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                  <Shield className={`w-4 h-4 flex-shrink-0 ${user?.isVerified ? 'text-green-500' : 'text-yellow-500'}`} />
                  <span className={`text-sm ${user?.isVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                    {user?.isVerified ? 'Email Verified' : 'Email Not Verified'}
                  </span>
                </div>
                {process.env.NODE_ENV === 'development' && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={async () => {
                        try {
                          console.log('=== TESTING CONNECTIVITY ===');
                          const response = await authAPI.test();
                          console.log('Test Response:', response.data);
                          toast.success('Server connectivity OK');
                        } catch (error) {
                          console.error('Connectivity test failed:', error);
                          toast.error('Server connectivity failed');
                        }
                      }}
                    >
                      Test Server
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={async () => {
                        try {
                          console.log('=== FETCHING DEBUG INFO ===');
                          const response = await authAPI.debug();
                          console.log('=== DEBUG INFO ===');
                          console.log('User Data:', response.data.user);
                          console.log('Token (partial):', response.data.token);
                          console.log('Full Response:', response.data);
                          console.log('==================');
                          toast.success('Debug info logged to console');
                        } catch (error) {
                          console.error('Debug error:', error);
                          console.error('Error response:', error.response);
                          const message = error.response?.data?.message || error.message;
                          toast.error(`Debug failed: ${message}`);
                        }
                      }}
                    >
                      Debug Info
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <p className="text-sm text-red-700">
                  Deleting your account will permanently remove all your data including notes, settings, and account information. This action cannot be undone.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 justify-center"
                  onClick={() => setShowDeleteModal(true)}
                  icon={Trash2}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setFormErrors({});
        }}
        title="Change Password"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              name="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              error={formErrors.currentPassword}
              icon={Lock}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility('current')}
              style={{ marginTop: '12px' }} // Offset for label height
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              name="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              error={formErrors.newPassword}
              icon={Lock}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility('new')}
              style={{ marginTop: '12px' }} // Offset for label height
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              error={formErrors.confirmPassword}
              icon={Lock}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility('confirm')}
              style={{ marginTop: '12px' }} // Offset for label height
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              onClick={handleChangePassword}
              loading={loading}
              className="flex-1"
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowChangePasswordModal(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setFormErrors({});
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmText('');
        }}
        title="Delete Account"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you absolutely sure?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-semibold text-red-600">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Type DELETE here"
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              onClick={handleDeleteAccount}
              loading={loading}
              disabled={deleteConfirmText !== 'DELETE'}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Account
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
