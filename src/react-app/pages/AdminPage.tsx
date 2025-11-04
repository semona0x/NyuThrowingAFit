

/**
 * @description This file defines the AdminPage component for NYUThrowingAFit owner-only admin dashboard.
 *             It provides a secure admin interface with schema-driven auto-adaptation and full CRUD management.
 *             The component checks admin status, loads all schemas dynamically, and renders appropriate tables.
 *             It uses Nike-inspired styling with strong contrast and maintains visual consistency with the main site.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@hey-boss/users-service/react';
import { Navigate } from 'react-router-dom';
import { Loader2, Database, LogOut, User, Shield } from 'lucide-react';
import { useAdminSchemas } from '../hooks/useAdminSchemas';
import { SchemaTable } from '../components/admin/SchemaTable';

export const AdminPage = () => {
  const { user, logout } = useAuth();
  const { adminStatus, schemas, schemaNames, loading: schemasLoading, error } = useAdminSchemas();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // Check loading states
  useEffect(() => {
    if (adminStatus !== null) {
      setStatusLoading(false);
    }
  }, [adminStatus]);

  // Auto-select first table when schemas load
  useEffect(() => {
    if (schemaNames.length > 0 && !selectedTable) {
      setSelectedTable(schemaNames[0]);
    }
  }, [schemaNames, selectedTable]);

  // Show loading spinner while checking admin status
  if (!user || statusLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-black" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login?returnUrl=/admin" replace />;
  }

  // Show "Not an administrator" if not admin
  if (adminStatus && !adminStatus.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You are not authorized to access this admin dashboard.
          </p>
          <button
            onClick={() => logout()}
            className="inline-flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Database className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-black uppercase tracking-wide">
                  NYUThrowingAFit
                </h1>
                <p className="text-xs text-gray-300">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {schemasLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-black" />
            <p className="text-gray-600">Loading database schemas...</p>
          </div>
        ) : schemaNames.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Database Tables Found</h2>
            <p className="text-gray-600 mb-6">
              Add schema files to <code className="bg-gray-100 px-2 py-1 rounded">src/shared/schemas/</code> to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Table List */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="font-bold text-black uppercase text-sm tracking-wide">
                    Database Tables
                  </h2>
                </div>
                <nav className="space-y-1">
                  {schemaNames.map((tableName) => {
                    const schema = schemas[tableName];
                    const isActive = selectedTable === tableName;
                    
                    return (
                      <button
                        key={tableName}
                        onClick={() => setSelectedTable(tableName)}
                        className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          isActive ? 'bg-black text-white' : 'text-gray-700'
                        }`}
                      >
                        <div className="font-medium">
                          {schema?.title || tableName}
                        </div>
                        {schema?.description && (
                          <div className={`text-xs mt-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                            {schema.description}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content - Selected Table */}
            <div className="lg:col-span-3">
              {selectedTable && schemas[selectedTable] ? (
                <SchemaTable
                  tableName={selectedTable}
                  schema={schemas[selectedTable]}
                />
              ) : (
                <div className="bg-white border border-gray-200 p-8 text-center">
                  <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Select a table from the sidebar to manage its data.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

