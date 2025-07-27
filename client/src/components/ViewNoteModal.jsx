import React from 'react';
import { Calendar, Tag, X } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const ViewNoteModal = ({ isOpen, onClose, note }) => {
  if (!note) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content) => {
    // Convert line breaks to paragraphs for better display
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        <p key={index} className="mb-3 last:mb-0">
          {paragraph}
        </p>
      ) : (
        <div key={index} className="h-3" />
      )
    ));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-4xl max-h-[90vh]"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {note.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Created: {formatDate(note.createdAt)}
              </div>
              {note.updatedAt !== note.createdAt && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Updated: {formatDate(note.updatedAt)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {formatContent(note.content)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewNoteModal;
