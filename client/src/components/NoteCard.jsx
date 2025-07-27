import { useState, useRef } from 'react';
import { Edit, Trash2, Calendar, MoreVertical, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EditNoteModal from './EditNoteModal';
import ViewNoteModal from './ViewNoteModal';

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownButtonRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  const isContentTruncated = (content, maxLength = 150) => {
    return content.length > maxLength;
  };

  const handleDelete = () => {
    onDelete(note._id);
    setShowDeleteModal(false);
  };

  const handleUpdate = (updatedData) => {
    onUpdate(note._id, updatedData);
    setShowEditModal(false);
  };

  const handleCardClick = () => {
    setShowViewModal(true);
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    if (!showDropdown && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right
      });
    }
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 cursor-pointer hover:border-blue-200"
        onClick={handleCardClick}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {note.title}
            </h3>
            <div className="relative">
              <button
                ref={dropdownButtonRef}
                onClick={handleDropdownToggle}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm line-clamp-3">
              {truncateContent(note.content)}
            </p>
            {isContentTruncated(note.content) && (
              <p className="text-xs text-blue-600 mt-1 opacity-70 hover:opacity-100 transition-opacity">
                Click to read full note
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(note.updatedAt)}
            </div>
            
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {note.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{note.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Dropdown Menu - positioned outside card to avoid overflow issues */}
      {showDropdown && (
        <div className="fixed inset-0 z-50" onClick={() => setShowDropdown(false)}>
          <div 
            className="absolute w-48 bg-white rounded-md shadow-lg border border-gray-200"
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors duration-150"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Note
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors duration-150"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Note
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors duration-150"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      <ViewNoteModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        note={note}
      />

      {/* Edit Modal */}
      <EditNoteModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        note={note}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Note"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{note.title}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex-1"
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NoteCard;
