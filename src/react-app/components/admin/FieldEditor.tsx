/**
 * @description This file defines the FieldEditor component for NYUThrowingAFit admin dashboard.
 *             It provides a generic field editor that maps schema field types to appropriate input components.
 *             The component supports all field types including text, number, date, file uploads, and rich text.
 *             It handles validation, error display, and provides consistent styling across all field types.
 */

import React, { useState } from 'react';
import { Upload, X, File, Image } from 'lucide-react';
import { adminService } from '../../services/adminService';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = React.lazy(() => import('react-quill'));

interface FieldEditorProps {
  fieldName: string;
  fieldSchema: any;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  fieldName,
  fieldSchema,
  value,
  onChange,
  error
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isReadOnly = fieldSchema.readOnly || fieldSchema.primaryKey;
  const isRequired = fieldSchema.required;
  const fieldType = fieldSchema.type;
  const format = fieldSchema.format;

  const handleFileUpload = async (file: File, isMedia: boolean = false) => {
    try {
      setUploading(true);
      setUploadError(null);
      
      const result = isMedia 
        ? await adminService.uploadMedia(file)
        : await adminService.uploadFile(file);
      
      onChange(result.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const renderField = () => {
    // Read-only fields
    if (isReadOnly) {
      return (
        <div className="px-3 py-2 bg-gray-100 border border-gray-300 text-gray-600 text-sm">
          {value || 'Auto-generated'}
        </div>
      );
    }

    // Field type mapping
    switch (fieldType) {
      case 'integer':
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder={`Enter ${fieldSchema.title || fieldName}`}
          />
        );

      case 'string':
        // Handle different string formats
        if (format === 'email') {
          return (
            <input
              type="email"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder={`Enter ${fieldSchema.title || fieldName}`}
            />
          );
        }
        
        if (format === 'date-time') {
          return (
            <input
              type="datetime-local"
              value={value ? new Date(value).toISOString().slice(0, 16) : ''}
              onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          );
        }

        if (format === 'uri' || fieldName.includes('url')) {
          return (
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder={`Enter ${fieldSchema.title || fieldName}`}
            />
          );
        }

        // Media URL field
        if (fieldName.includes('media_url') || fieldName.includes('image')) {
          return (
            <div className="space-y-2">
              {value && (
                <div className="relative">
                  <img 
                    src={value} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover border border-gray-300"
                  />
                  <button
                    onClick={() => onChange('')}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter image URL or upload"
                />
                <label className="inline-flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800 cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, true);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            </div>
          );
        }

        // File URL field
        if (fieldName.includes('file_url') || fieldName.includes('document')) {
          return (
            <div className="space-y-2">
              {value && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-300">
                  <File className="w-4 h-4" />
                  <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    {value.split('/').pop()}
                  </a>
                  <button
                    onClick={() => onChange('')}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter file URL or upload"
                />
                <label className="inline-flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800 cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, false);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            </div>
          );
        }

        // Rich text field
        if (fieldName.includes('rich_text') || fieldName.includes('html')) {
          return (
            <React.Suspense fallback={<div className="p-4 bg-gray-100">Loading editor...</div>}>
              <ReactQuill
                value={value || ''}
                onChange={onChange}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
                style={{ minHeight: '200px' }}
              />
            </React.Suspense>
          );
        }

        // Long text (textarea)
        if (fieldSchema.maxLength > 255 || fieldName.includes('description') || fieldName.includes('content')) {
          return (
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-vertical"
              placeholder={`Enter ${fieldSchema.title || fieldName}`}
            />
          );
        }

        // Regular text input
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder={`Enter ${fieldSchema.title || fieldName}`}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300"
            />
            <span className="text-sm">{fieldSchema.title || fieldName}</span>
          </label>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder={`Enter ${fieldSchema.title || fieldName}`}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {fieldSchema.title || fieldName}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {fieldSchema.description && (
        <p className="text-xs text-gray-500">{fieldSchema.description}</p>
      )}
      
      {renderField()}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

