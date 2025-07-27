import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const EditNoteModal = ({ isOpen, onClose, onSubmit, note }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        tags: note.tags ? note.tags.join(', ') : '',
      });
    }
  }, [note]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags 
          ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : [],
      };

      await onSubmit(noteData);
      handleClose();
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Note"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          placeholder="Enter note title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Content
          </label>
          <textarea
            name="content"
            rows={8}
            placeholder="Write your note content here..."
            value={formData.content}
            onChange={handleChange}
            className={`
              block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-transparent transition-all duration-200 resize-none
              ${errors.content ? 'border-red-500 focus:ring-red-500' : ''}
            `}
            required
          />
          {errors.content && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>
          )}
        </div>

        <Input
          label="Tags (optional)"
          name="tags"
          placeholder="Enter tags separated by commas (e.g., work, ideas, important)"
          value={formData.tags}
          onChange={handleChange}
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            icon={Edit}
            className="flex-1"
          >
            Update Note
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditNoteModal;
