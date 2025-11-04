

/**
 * @description This file defines the admin service for NYUThrowingAFit admin dashboard API calls.
 *             It provides methods for schema discovery, CRUD operations, file uploads, and CSV exports.
 *             The service handles authentication, error handling, and proper response formatting.
 *             All methods interact with the Cloudflare Worker backend with strict admin checks.
 */

export interface Schema {
  $schema: string;
  $id: string;
  type: string;
  title: string;
  description: string;
  required: string[];
  properties: Record<string, any>;
}

export interface TableRow {
  id: string | number;
  [key: string]: any;
}

export interface AdminStatus {
  isAdmin: boolean;
}

export interface UploadResponse {
  url: string;
}

class AdminService {
  private baseUrl = '/api';

  async checkAdminStatus(): Promise<AdminStatus> {
    const response = await fetch(`${this.baseUrl}/admin/status`);
    if (!response.ok) {
      throw new Error('Failed to check admin status');
    }
    return response.json();
  }

  async getSchemas(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/admin/schemas`);
    if (!response.ok) {
      throw new Error('Failed to fetch schemas');
    }
    return response.json();
  }

  async getSchema(tableName: string): Promise<Schema> {
    const response = await fetch(`${this.baseUrl}/admin/schemas/${tableName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch schema for ${tableName}`);
    }
    return response.json();
  }

  async getTableData(
    tableName: string,
    options: {
      page?: number;
      limit?: number;
      sort?: string;
      filters?: Record<string, any>;
    } = {}
  ): Promise<{ data: TableRow[]; total: number; hasMore: boolean }> {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.sort) params.append('sort', options.sort);
    
    // Add filters as query params
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/tables/${tableName}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${tableName}`);
    }
    return response.json();
  }

  async createRow(tableName: string, data: Record<string, any>): Promise<TableRow> {
    const response = await fetch(`${this.baseUrl}/tables/${tableName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create row in ${tableName}`);
    }
    return response.json();
  }

  async updateRow(tableName: string, id: string | number, data: Record<string, any>): Promise<TableRow> {
    const response = await fetch(`${this.baseUrl}/tables/${tableName}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update row in ${tableName}`);
    }
    return response.json();
  }

  async deleteRow(tableName: string, id: string | number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/tables/${tableName}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete row from ${tableName}`);
    }
  }

  async uploadMedia(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload/media`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload media file');
    }
    return response.json();
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload/file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    return response.json();
  }

  async exportTable(
    tableName: string,
    options: {
      sort?: string;
      filters?: Record<string, any>;
    } = {}
  ): Promise<void> {
    const params = new URLSearchParams();
    
    if (options.sort) params.append('sort', options.sort);
    
    // Add filters as query params
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/tables/${tableName}/export?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to export ${tableName}`);
    }

    // Download the CSV file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export const adminService = new AdminService();

