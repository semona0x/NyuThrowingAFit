

/**
 * @description This file defines the SchemaTable component for NYUThrowingAFit admin dashboard.
 *             It provides a generic table component that auto-adapts to any schema definition.
 *             The component supports full CRUD operations, pagination, sorting, filtering, and CSV export.
 *             It renders appropriate field editors and handles all user interactions with proper validation.
 */

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Download, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Schema, TableRow } from '../../services/adminService';
import { FieldEditor } from './FieldEditor';
import { useAdminSchemas } from '../../hooks/useAdminSchemas';

interface SchemaTableProps {
  tableName: string;
  schema: Schema;
}

export const SchemaTable: React.FC<SchemaTableProps> = ({ tableName, schema }) => {
  const { tableData, loadTableData, createRow, updateRow, deleteRow, exportTable, loading, error } = useAdminSchemas();
  
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingRow, setEditingRow] = useState<TableRow | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const limit = 50;
  const data = tableData[tableName];

  // Load table data
  useEffect(() => {
    const loadOptions = {
      page: currentPage,
      limit,
      sort: sortField ? `${sortField}:${sortDirection}` : undefined,
      filters: searchTerm ? { search: searchTerm, ...filters } : filters,
    };
    loadTableData(tableName, loadOptions);
  }, [tableName, currentPage, sortField, sortDirection, searchTerm, filters, loadTableData]);

  // Get field properties
  const fields = Object.entries(schema.properties || {}).filter(([key]) => key !== 'id');
  const requiredFields = schema.required || [];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingRow(null);
    setFormData({});
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (row: TableRow) => {
    setModalMode('edit');
    setEditingRow(row);
    setFormData({ ...row });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRow(null);
    setFormData({});
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    requiredFields.forEach(fieldName => {
      if (!formData[fieldName] && !schema.properties[fieldName]?.readOnly) {
        errors[fieldName] = `${schema.properties[fieldName]?.title || fieldName} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Remove read-only fields from form data
      const submitData = { ...formData };
      Object.keys(schema.properties).forEach(key => {
        if (schema.properties[key].readOnly) {
          delete submitData[key];
        }
      });

      if (modalMode === 'create') {
        await createRow(tableName, submitData);
      } else if (editingRow) {
        await updateRow(tableName, editingRow.id, submitData);
      }
      
      closeModal();
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async (row: TableRow) => {
    if (confirm(`Are you sure you want to delete this ${schema.title} record?`)) {
      try {
        await deleteRow(tableName, row.id);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleExport = async () => {
    try {
      const exportOptions = {
        sort: sortField ? `${sortField}:${sortDirection}` : undefined,
        filters: searchTerm ? { search: searchTerm, ...filters } : filters,
      };
      await exportTable(tableName, exportOptions);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const formatCellValue = (value: any, fieldName: string, fieldSchema: any) => {
    if (value === null || value === undefined) return '';
    
    // Handle different field types
    if (fieldSchema.format === 'date-time') {
      return new Date(value).toLocaleString();
    }
    
    if (fieldName.includes('url') && value) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </a>
      );
    }
    
    if (fieldName.includes('rich_text') && value) {
      // Strip HTML for table display
      const stripped = value.replace(/<[^>]*>/g, '');
      return stripped.length > 100 ? `${stripped.substring(0, 100)}...` : stripped;
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (typeof value === 'string' && value.length > 100) {
      return `${value.substring(0, 100)}...`;
    }
    
    return value.toString();
  };

  return (
    <div className="bg-white border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-black uppercase tracking-wide">
            {schema.title || tableName}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${schema.title || tableName}...`}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Operations
              </th>
              {fields.map(([fieldName, fieldSchema]) => (
                <th
                  key={fieldName}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(fieldName)}
                >
                  <div className="flex items-center gap-1">
                    {fieldSchema.title || fieldName}
                    {sortField === fieldName && (
                      <span className="text-black">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(row)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                {fields.map(([fieldName, fieldSchema]) => (
                  <td key={fieldName} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCellValue(row[fieldName], fieldName, fieldSchema)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.total > limit && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, data.total)} of {data.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {Math.ceil(data.total / limit)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!data.hasMore}
              className="p-2 border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-black uppercase">
                {modalMode === 'create' ? 'Add New' : 'Edit'} {schema.title || tableName}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {fields.map(([fieldName, fieldSchema]) => (
                <FieldEditor
                  key={fieldName}
                  fieldName={fieldName}
                  fieldSchema={fieldSchema}
                  value={formData[fieldName]}
                  onChange={(value) => setFormData(prev => ({ ...prev, [fieldName]: value }))}
                  error={formErrors[fieldName]}
                />
              ))}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {modalMode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

