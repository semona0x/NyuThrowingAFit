

/**
 * @description This file defines the useAdminSchemas hook for NYUThrowingAFit admin dashboard.
 *             It manages schema discovery, admin status checking, and data caching for optimal performance.
 *             The hook provides reactive state management for all admin operations and error handling.
 *             It automatically handles loading states and provides methods for CRUD operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { adminService, Schema, TableRow, AdminStatus } from '../services/adminService';

interface UseAdminSchemasResult {
  adminStatus: AdminStatus | null;
  schemas: Record<string, Schema>;
  schemaNames: string[];
  tableData: Record<string, { data: TableRow[]; total: number; hasMore: boolean }>;
  loading: boolean;
  error: string | null;
  
  // Methods
  checkAdminStatus: () => Promise<void>;
  loadSchemas: () => Promise<void>;
  loadTableData: (tableName: string, options?: any) => Promise<void>;
  createRow: (tableName: string, data: Record<string, any>) => Promise<void>;
  updateRow: (tableName: string, id: string | number, data: Record<string, any>) => Promise<void>;
  deleteRow: (tableName: string, id: string | number) => Promise<void>;
  exportTable: (tableName: string, options?: any) => Promise<void>;
}

export const useAdminSchemas = (): UseAdminSchemasResult => {
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [schemas, setSchemas] = useState<Record<string, Schema>>({});
  const [schemaNames, setSchemaNames] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, { data: TableRow[]; total: number; hasMore: boolean }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await adminService.checkAdminStatus();
      setAdminStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check admin status');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSchemas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await adminService.getSchemas();
      setSchemaNames(names);

      // Load all schema definitions
      const schemaPromises = names.map(async (name) => {
        const schema = await adminService.getSchema(name);
        return [name, schema] as [string, Schema];
      });

      const schemaEntries = await Promise.all(schemaPromises);
      const schemaMap = Object.fromEntries(schemaEntries);
      setSchemas(schemaMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schemas');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTableData = useCallback(async (tableName: string, options: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getTableData(tableName, options);
      setTableData(prev => ({
        ...prev,
        [tableName]: data
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load data for ${tableName}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRow = useCallback(async (tableName: string, data: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.createRow(tableName, data);
      // Reload table data after creation
      await loadTableData(tableName);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to create row in ${tableName}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTableData]);

  const updateRow = useCallback(async (tableName: string, id: string | number, data: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.updateRow(tableName, id, data);
      // Reload table data after update
      await loadTableData(tableName);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to update row in ${tableName}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTableData]);

  const deleteRow = useCallback(async (tableName: string, id: string | number) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteRow(tableName, id);
      // Reload table data after deletion
      await loadTableData(tableName);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete row from ${tableName}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTableData]);

  const exportTable = useCallback(async (tableName: string, options: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.exportTable(tableName, options);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to export ${tableName}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load admin status and schemas on mount
  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  useEffect(() => {
    if (adminStatus?.isAdmin) {
      loadSchemas();
    }
  }, [adminStatus, loadSchemas]);

  return {
    adminStatus,
    schemas,
    schemaNames,
    tableData,
    loading,
    error,
    checkAdminStatus,
    loadSchemas,
    loadTableData,
    createRow,
    updateRow,
    deleteRow,
    exportTable,
  };
};

