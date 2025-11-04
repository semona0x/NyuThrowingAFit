




import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  SESSION_TOKEN_COOKIE_NAME,
  sendOTP,
  verifyOTP,
  getCurrentUser,
} from "@hey-boss/users-service/backend";

const app = new Hono<{
  Bindings: {
    DB: D1Database;
    API_KEY: string;
    USER_ID: string;
    PROJECT_ID: string;
    USER_EMAIL: string;
    AUTH_KEY: string;
  };
}>();

// =================================================================
// == AI-ASSISTANT / DEVELOPER: DO NOT MODIFY THE CODE BELOW      ==
// =================================================================
//
// The following four routes handle critical user authentication logic.
// They are essential for user login, session creation, and logout.
// Any changes to this section can break the entire authentication flow.
//
// PROTECTED ROUTES:
// - GET /api/oauth/google/redirect_url
// - POST /api/sessions
// - GET /api/users/me
// - GET /api/logout
// - POST /api/send-otp
// - POST /api/verify-otp
//
// Please add any new routes AFTER this block.
// =================================================================
const SHOPPING_SERVICE_ENDPOINT = "https://shopping.heybossai.com";

app.get("/api/oauth/google/redirect_url", async (c) => {
  const origin = c.req.query("originUrl") || "";
  const redirectUrl = await getOAuthRedirectUrl("google", {
    originUrl: origin,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(
    body.code,
    c.env.PROJECT_ID
  );

  setCookie(c, SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 1 * 24 * 60 * 60, // 1 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  //@ts-ignore
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken);
  }

  setCookie(c, SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

app.post("/api/send-otp", async (c) => {
  const body = await c.req.json();
  const email = body.email;
  if (!email) {
    return c.json({ error: "No email provided" }, 400);
  }
  const data = await sendOTP(email, c.env.PROJECT_ID);
  if (data.error) {
    return c.json({ error: data.error }, 400);
  }
  return c.json({ success: true }, 200);
});

app.post("/api/verify-otp", async (c) => {
  const body = await c.req.json();
  const email = body.email;
  const otp = body.otp;
  if (!email) {
    return c.json({ error: "No email provided" }, 400);
  }
  if (!otp) {
    return c.json({ error: "No otp provided" }, 400);
  }
  const data = await verifyOTP(email, otp);

  if (data.error) {
    return c.json({ error: data.error }, 400);
  }
  const sessionToken = data.sessionToken;

  setCookie(c, SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 1 * 24 * 60 * 60, // 1 day
  });
  return c.json({ success: true, data }, 200);
});

/**
 * 创建支付结账会话接口
 *
 * @description 创建支付结账会话，用于处理商品购买流程
 *
 * @param {Object} body - 请求体
 * @param {ProductDto[]} body.products - 订单商品列表，包含商品ID、数量、价格等信息
 * @param {string} [body.successRouter] - 支付成功后的跳转路由
 * @param {string} [body.cancelRouter] - 支付取消后的跳转路由
 *
 * @returns {Object} 响应数据
 * @returns {string} [response.checkoutUrl] - 支付页面URL，用于重定向用户到支付页面
 * @returns {string} [response.sessionId] - 支付会话ID，用于后续查询支付状态
 * @returns {Object} [response.error] - 错误信息（当请求失败时）
 * @returns {string} [response.error.message] - 错误描述
 * @returns {number} [response.error.code] - 错误代码
 *
 * @example
 * // 请求示例
 * POST /api/create-checkout-session
 * {
 *   "products": [
 *     {
 *       "productId": "prod_123",
 *       "quantity": 2
 *     }
 *   ],
 *   "successRouter": "/success",
 *   "cancelRouter": "/cancel"
 * }
 *
 * // 成功响应示例
 * {
 *   "checkoutUrl": "https://checkout.stripe.com/pay/cs_xxx",
 *   "sessionId": "cs_xxx"
 * }
 *
 * // 错误响应示例
 * {
 *   "message": "商品不存在",
 *   "code": "PRODUCT_NOT_FOUND"
 * }
 */
app.post("/api/create-checkout-session", async (c) => {
  const { products, successRouter, cancelRouter } = await c.req.json();
  let user = null;
  const sessionToken = getCookie(c, SESSION_TOKEN_COOKIE_NAME);
  if (sessionToken) {
    user = await getCurrentUser(sessionToken);
  }

  const url = new URL(c.req.url);

  const response = await fetch(
    `${SHOPPING_SERVICE_ENDPOINT}/api/payment/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-worker-origin": url.origin,
        "x-req-id": crypto.randomUUID(),
      },
      body: JSON.stringify({
        projectId: c.env.PROJECT_ID,
        customerEmail: user?.email,
        products,
        successUrl: successRouter,
        cancelUrl: cancelRouter,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return c.json(data, 400);
  }
  return c.json(data, 200);
});

/**
 * 获取商品列表接口
 *
 * @description 获取已上架的商品列表，用于展示商品列表
 *
 * @returns {Object} 响应数据
 * @returns {ProductDto[]} response - 商品列表数组
 * @returns {string} response[].id - 商品唯一标识符
 * @returns {string} response[].createdAt - 商品创建时间 (ISO 8601格式)
 * @returns {string} response[].updatedAt - 商品最后更新时间 (ISO 8601格式)
 * @returns {string} response[].projectId - 项目ID
 * @returns {string} response[].name - 商品名称
 * @returns {string} response[].description - 商品描述
 * @returns {number} response[].price - 商品价格（以分为单位）
 * @returns {string} response[].currency - 货币类型 (如: "usd")
 * @returns {string} response[].type - 商品类型 (如: "digital" 数字商品)
 * @returns {string} response[].status - 商品状态 (如: "active" 已上架)
 * @returns {string|null} response[].images - 商品图片URL（可能为null）
 * @returns {Object} response[].productConfig - 商品配置信息
 * @returns {string} response[].productConfig.fileUrl - 商品文件URL（数字商品）
 *
 * @example
 * // 请求示例
 * GET /api/products
 *
 * // 成功响应示例
 * [
 *   {
 *     "id": "63041696-1939-4fea-8965-0bf51effffc7",
 *     "createdAt": "2025-09-09T19:01:02.284Z",
 *     "updatedAt": "2025-09-09T19:01:02.284Z",
 *     "projectId": "689d91ee97820b835370d021",
 *     "name": "dsfds",
 *     "description": "",
 *     "price": 100000,
 *     "currency": "usd",
 *     "type": "digital",
 *     "status": "active",
 *     "images": null,
 *     "productConfig": {
 *       "fileUrl": "689d91ee97820b835370d021/digital-products/wechat_2025-09-09_154937_808.png-1757473258081"
 *     }
 *   }
 * ]
 *
 * // 错误响应示例
 * {
 *   "message": "获取商品列表失败",
 *   "code": "PRODUCTS_FETCH_ERROR"
 * }
 */
app.get("/api/products", async (c) => {
  const response = await fetch(
    `${SHOPPING_SERVICE_ENDPOINT}/api/products?projectId=${c.env.PROJECT_ID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-req-id": crypto.randomUUID(),
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return c.json(data, 400);
  }
  return c.json(data, 200);
});

/**
 * 获取商品购买详情接口
 *
 * @description 根据支付会话ID获取商品购买详情，包括商品下载地址等信息
 *
 * @param {string} sessionId - 支付会话ID（通过query参数传入）
 *
 * @returns {Object} 响应数据
 * @returns {string} response.type - 商品类型 ("digital" | "subscription")
 * @returns {string} [response.downloadUrl] - 数字商品的下载地址（当type为"digital"时）
 * @returns {string} [response.expirsAt] - 订阅商品的过期时间（当type为"subscription"时）
 * @returns {string} [response.message] - 错误描述（当请求失败时）
 * @returns {string} [response.code] - 错误代码（当请求失败时）
 *
 * @example
 * // 请求示例
 * GET /api/products/purchase-detail?sessionId=cs_xxx
 *
 * // 数字商品成功响应示例
 * {
 *   "type": "digital",
 *   "downloadUrl": "https://example.com/download/product-file.zip"
 * }
 *
 * // 订阅商品成功响应示例
 * {
 *   "type": "subscription",
 *   "expirsAt": "2025-09-14T10:00:00.000Z"
 * }
 *
 * // 错误响应示例
 * {
 *   "message": "订阅已过期",
 *   "code": "SUBSCRIPTION_EXPIRED"
 * }
 */
app.get("/api/products/purchase-detail", async (c) => {
  const sessionId = c.req.query("sessionId") || "";
  if (!sessionId) {
    return c.json({ error: "No sessionId provided" }, 400);
  }

  const response = await fetch(
    `${SHOPPING_SERVICE_ENDPOINT}/api/products/purchase-detail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-req-id": crypto.randomUUID(),
      },
      body: JSON.stringify({
        projectId: c.env.PROJECT_ID,
        sessionId,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return c.json(data, 400);
  }
  return c.json(data, 200);
});

/**
 * 获取订阅记录
 */
app.get("/api/subscriptions", authMiddleware, async (c) => {
  try {
    //@ts-ignore
    const user = c.get("user");

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM subscription_records WHERE email = ? ORDER BY created_at DESC"
    )
      .bind(user.email)
      .all();

    return c.json(results);
  } catch (error) {
    console.error("获取订阅记录失败:", error);
    return c.json({ error: "failed to get subscription records" }, 500);
  }
});

/**
 * 保存订阅记录
 */
app.post("/api/subscriptions", authMiddleware, async (c) => {
  try {
    //@ts-ignore
    const user = c.get("user");
    const { sessionId } = await c.req.json();

    if (!sessionId) {
      return c.json({ error: "missing sessionId" }, 400);
    }

    // 获取用户 ID
    const { results: userResults } = await c.env.DB.prepare(
      "SELECT id FROM users WHERE email = ?"
    )
      .bind(user.email)
      .all();

    if (userResults.length === 0) {
      return c.json({ error: "user not found" }, 404);
    }

    const userId = (userResults[0] as any).id;

    // 检查是否已存在记录
    const { results: existingRecords } = await c.env.DB.prepare(
      "SELECT id FROM subscription_records WHERE session_id = ?"
    )
      .bind(sessionId)
      .all();

    if (existingRecords.length > 0) {
      return c.json({ message: "subscription record already exists" });
    }

    // 保存订阅记录
    await c.env.DB.prepare(
      "INSERT INTO subscription_records (user_id, email, session_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(
        userId,
        user.email,
        sessionId,
        new Date().toISOString(),
        new Date().toISOString()
      )
      .run();

    return c.json({
      success: true,
      message: "subscription record saved successfully",
    });
  } catch (error) {
    console.error("failed to save subscription record:", error);
    return c.json({ error: "failed to save subscription record" }, 500);
  }
});
// =================================================================
// == END OF PROTECTED AUTHENTICATION ROUTES                      ==
// =================================================================

// Import email service and config
import { handleFormSubmissionEmails } from "../shared/email-service";
import formConfig from "../shared/form-configs.json";
import { stringify } from "csv-stringify/sync";
import * as fs from 'fs';
import * as path from 'path';

// =================================================================
// == ADMIN ROUTES WITH STRICT SECURITY                           ==
// =================================================================

// Helper function for strict admin check
const checkAdminAccess = (c: any) => {
  const user = c.get("user");
  if (!user || user.email !== c.env.USER_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }
  return null;
};

// Get admin status
app.get("/api/admin/status", authMiddleware, async (c) => {
  try {
    //@ts-ignore
    const user = c.get("user");
    const isAdmin = user?.email === c.env.USER_EMAIL;
    return c.json({ isAdmin });
  } catch (error) {
    console.error("Admin status check error:", error);
    return c.json({ error: "Failed to check admin status" }, 500);
  }
});

// Get all schemas
app.get("/api/admin/schemas", authMiddleware, async (c) => {
  const adminCheck = checkAdminAccess(c);
  if (adminCheck) return adminCheck;

  try {
    // This would normally read from filesystem, but in Workers we'll return the known schemas
    const schemaNames = ["newsletter_signups", "community_fits"]; // Add more as they're created
    return c.json(schemaNames);
  } catch (error) {
    console.error("Schema list error:", error);
    return c.json({ error: "Failed to list schemas" }, 500);
  }
});

// Get specific schema
app.get("/api/admin/schemas/:tableName", authMiddleware, async (c) => {
  const adminCheck = checkAdminAccess(c);
  if (adminCheck) return adminCheck;

  try {
    const tableName = c.req.param("tableName");
    
    // Import the schema dynamically
    let schema;
    try {
      schema = await import(`../shared/schemas/${tableName}-schema.json`);
    } catch (err) {
      return c.json({ error: "Schema not found" }, 404);
    }

    return c.json(schema);
  } catch (error) {
    console.error("Schema fetch error:", error);
    return c.json({ error: "Failed to fetch schema" }, 500);
  }
});

// Get table data with pagination, sorting, and filtering
app.get("/api/tables/:tableName", async (c) => {
  try {
    const tableName = c.req.param("tableName");
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "50");
    const sort = c.req.query("sort");
    const search = c.req.query("search");
    const approved = c.req.query("approved"); // For filtering approved community fits
    
    const offset = (page - 1) * limit;
    
    // Build query
    let query = `SELECT * FROM ${tableName}`;
    let countQuery = `SELECT COUNT(*) as total FROM ${tableName}`;
    let params: any[] = [];
    let countParams: any[] = [];
    let whereConditions: string[] = [];
    
    // Add search
    if (search) {
      // For community_fits, search in caption and user_handle
      if (tableName === "community_fits") {
        whereConditions.push(`(caption LIKE ? OR user_handle LIKE ?)`);
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
        countParams.push(searchParam, searchParam);
      } else {
        whereConditions.push(`(id LIKE ? OR created_at LIKE ?)`);
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
        countParams.push(searchParam, searchParam);
      }
    }
    
    // Add approved filter for community_fits
    if (approved !== undefined && tableName === "community_fits") {
      whereConditions.push(`approved = ?`);
      params.push(parseInt(approved));
      countParams.push(parseInt(approved));
    }
    
    // Apply WHERE conditions
    if (whereConditions.length > 0) {
      const whereClause = ` WHERE ${whereConditions.join(' AND ')}`;
      query += whereClause;
      countQuery += whereClause;
    }
    
    // Add sorting
    if (sort) {
      const [field, direction] = sort.split(":");
      query += ` ORDER BY ${field} ${direction === "desc" ? "DESC" : "ASC"}`;
    } else {
      query += ` ORDER BY created_at DESC`;
    }
    
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    // Execute queries
    const [dataResult, countResult] = await Promise.all([
      c.env.DB.prepare(query).bind(...params).all(),
      c.env.DB.prepare(countQuery).bind(...countParams).all()
    ]);
    
    const total = (countResult.results[0] as any)?.total || 0;
    const hasMore = offset + limit < total;
    
    return c.json({
      data: dataResult.results,
      total,
      hasMore
    });
  } catch (error) {
    console.error("Table data fetch error:", error);
    return c.json({ error: "Failed to fetch table data" }, 500);
  }
});

// Create new row
app.post("/api/tables/:tableName", authMiddleware, async (c) => {
  const adminCheck = checkAdminAccess(c);
  if (adminCheck) return adminCheck;

  try {
    const tableName = c.req.param("tableName");
    const data = await c.req.json();
    
    // Add timestamps
    data.created_at = new Date().toISOString();
    data.updated_at = new Date().toISOString();
    
    // Build insert query
    const fields = Object.keys(data);
    const placeholders = fields.map(() => "?").join(", ");
    const values = Object.values(data);
    
    const query = `INSERT INTO ${tableName} (${fields.join(", ")}) VALUES (${placeholders})`;
    const result = await c.env.DB.prepare(query).bind(...values).run();
    
    if (result.success) {
      // Return the created row
      const createdRow = await c.env.DB.prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
        .bind(result.meta.last_row_id).first();
      return c.json(createdRow);
    } else {
      return c.json({ error: "Failed to create row" }, 500);
    }
  } catch (error) {
    console.error("Row creation error:", error);
    return c.json({ error: "Failed to create row" }, 500);
  }
});

// Update row
app.put("/api/tables/:tableName/:id", authMiddleware, async (c) => {
  const adminCheck = checkAdminAccess(c);
  if (adminCheck) return adminCheck;

  try {
    const tableName = c.req.param("tableName");
    const id = c.req.param("id");
    const data = await c.req.json();
    
    // Add updated timestamp
    data.updated_at = new Date().toISOString();
    
    // Build update query
    const fields = Object.keys(data);
    const setClause = fields.map(field => `${field} = ?`).join(", ");
    const values = [...Object.values(data), id];
    
    const query = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    const result = await c.env.DB.prepare(query).bind(...values).run();
    
    if (result.success) {
      // Return the updated row
      const updatedRow = await c.env.DB.prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
        .bind(id).first();
      return c.json(updatedRow);
    } else {
      return c.json({ error: "Failed to update row" }, 500);
    }
  } catch (error) {
    console.error("Row update error:", error);
    return c.json({ error: "Failed to update row" }, 500);
  }
});

// Delete row
app.delete("/api/tables/:tableName/:id", authMiddleware, async (c) => {
  const adminCheck = checkAdminAccess(c);
  if (adminCheck) return adminCheck;

  try {
    const tableName = c.req.param("tableName");
    const id = c.req.param("id");
    
    const result = await c.env.DB.prepare(`DELETE FROM ${tableName} WHERE id = ?`)
      .bind(id).run();
    
    if (result.success) {
      return c.json({ success: true });
    } else {
      return c.json({ error: "Failed to delete row" }, 500);
    }
  } catch (error) {
    console.error("Row deletion error:", error);
    return c.json({ error: "Failed to delete row" }, 500);
  }
});

// Export table to CSV
app.get("/api/tables/:tableName/export", authMiddleware, async (c) => {
  const adminCheck = checkAdminAccess(c);
  if (adminCheck) return adminCheck;

  try {
    const tableName = c.req.param("tableName");
    const sort = c.req.query("sort");
    const search = c.req.query("search");
    
    // Build query (similar to GET but without pagination)
    let query = `SELECT * FROM ${tableName}`;
    let params: any[] = [];
    
    // Add search
    if (search) {
      query += ` WHERE id LIKE ? OR created_at LIKE ?`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
    }
    
    // Add sorting
    if (sort) {
      const [field, direction] = sort.split(":");
      query += ` ORDER BY ${field} ${direction === "desc" ? "DESC" : "ASC"}`;
    } else {
      query += ` ORDER BY created_at DESC`;
    }
    
    const result = await c.env.DB.prepare(query).bind(...params).all();
    const rows = result.results as any[];
    
    if (rows.length === 0) {
      const csv = "No data to export";
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${tableName}.csv"`
        }
      });
    }
    
    // Process data - strip HTML from rich_text fields
    const processedRows = rows.map(row => {
      const processed = { ...row };
      Object.keys(processed).forEach(key => {
        if (key.includes("rich_text") && processed[key]) {
          // Strip HTML tags
          processed[key] = processed[key].replace(/<[^>]*>/g, "");
        }
      });
      return processed;
    });
    
    // Convert to CSV
    const csv = stringify(processedRows, {
      header: true,
      columns: Object.keys(rows[0])
    });
    
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${tableName}.csv"`
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return c.json({ error: "Failed to export data" }, 500);
  }
});

// Upload media (public endpoint for community fits)
app.post("/api/upload/media", async (c) => {

  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }
    
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Upload using HeyBoss OSS API
    const response = await fetch('https://api.heybossai.com/v1/run', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${c.env.API_KEY}`
      },
      body: JSON.stringify({
        model: "cloudflare/oss/upload",
        inputs: {
          base64_data: base64
        }
      })
    });

    if (!response.ok) {
      throw new Error('Upload failed: Server returned an error');
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error('Upload failed: Incorrect response format');
    }

    return c.json({ url: data.url });
  } catch (error) {
    console.error("Media upload error:", error);
    return c.json({ error: "Failed to upload media" }, 500);
  }
});

// Upload file (admin only)
app.post("/api/upload/file", authMiddleware, async (c) => {
  const adminCheck = checkAdminAccess(c);
  if (adminCheck) return adminCheck;

  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }
    
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Upload using HeyBoss OSS API
    const response = await fetch('https://api.heybossai.com/v1/run', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${c.env.API_KEY}`
      },
      body: JSON.stringify({
        model: "cloudflare/oss/upload",
        inputs: {
          base64_data: base64
        }
      })
    });

    if (!response.ok) {
      throw new Error('Upload failed: Server returned an error');
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error('Upload failed: Incorrect response format');
    }

    return c.json({ url: data.url });
  } catch (error) {
    console.error("File upload error:", error);
    return c.json({ error: "Failed to upload file" }, 500);
  }
});

// =================================================================
// == END ADMIN ROUTES                                            ==
// =================================================================

// =================================================================
// == FORM SUBMISSION WITH EMAIL CALLBACK                         ==
// =================================================================
// This is a generic template for AI customization
// AI SHOULD Modify this, to include data persistence logic.
// Handles form submissions and sends emails based on configuration

app.post("/api/forms/submit", async (c) => {
  try {
    const body = await c.req.json();
    const { formId, ...formData } = body;

    // Validate required fields
    if (!formId) {
      return c.json({ success: false, message: "Form ID is required" }, 400);
    }

    // Get email configuration for this form
    const formEmailConfig = (formConfig as any)[formId];

    if (!formEmailConfig) {
      console.warn(`No email configuration found for form: ${formId}`);
      return c.json({
        success: true,
        message: "Form submitted successfully (no email config)",
      });
    }

    // Extract uniqueness check (email for newsletter signups)
    const extractUniqueIdentifier = (data: any) => {
      return data.email || data.email_address || data.contact_email || data.phone || data.username || JSON.stringify(data);
    };

    // Store form data in database
    try {
      const dbSchemaName = formEmailConfig.dbSchemaName;
      const currentTime = new Date().toISOString();

      // Handle different form types
      if (formId === "community_fit_upload") {
        // For community fits, store in proper table structure
        // Map photo/photoUrl to image_urls field (photo contains filename, photoUrl contains hosted URL)
        const imageUrl = formData.photoUrl || formData.image_url;
        const imageUrls = imageUrl ? [imageUrl] : [];
        
        const insertResult = await c.env.DB.prepare(
          `INSERT INTO community_fits (user_handle, image_urls, caption, approved, like_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          formData.user_handle || null,
          JSON.stringify(imageUrls),
          formData.caption || "",
          0, // Draft status (pending approval) by default
          0, // Initial like count
          currentTime,
          currentTime
        ).run();

        if (!insertResult.success) {
          throw new Error("Failed to insert community fit");
        }
      } else {
        // For other forms, use the generic approach
        const uniquenessCheck = extractUniqueIdentifier(formData);

        // Check if submission already exists (deduplication)
        const existing = await c.env.DB.prepare(
          `SELECT id FROM ${dbSchemaName} WHERE uniqueness_check = ?`
        ).bind(uniquenessCheck).first();

        if (existing) {
          return c.json({
            success: false,
            message: "This submission already exists",
          }, 400);
        }

        // Insert new submission
        const insertResult = await c.env.DB.prepare(
          `INSERT INTO ${dbSchemaName} (uniqueness_check, form_data, notification_email_sent, reply_email_sent, email_sent_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          uniquenessCheck,
          JSON.stringify(formData),
          0, // Will be updated after email sending
          0, // Will be updated after email sending
          currentTime,
          currentTime,
          currentTime
        ).run();

        if (!insertResult.success) {
          throw new Error("Failed to insert form data");
        }
      }

      console.log(`Form data stored successfully for ${formId}`);
    } catch (dbError) {
      console.error("Database storage error:", dbError);
      // Continue with email sending even if DB fails
    }

    // Send emails using the universal callback
    const emailResult = await handleFormSubmissionEmails(
      formId,
      formData,
      formEmailConfig,
      {
        API_KEY: c.env.API_KEY || "",
        PROJECT_ID: c.env.PROJECT_ID || "",
        USER_EMAIL: c.env.USER_EMAIL || "",
      }
    );

    if (!emailResult.success) {
      console.error("Email sending errors:", emailResult.errors);
      return c.json({
        success: true,
        message: "Form submitted but some emails failed",
        emailErrors: emailResult.errors,
      });
    }

    return c.json({
      success: true,
      message: "Form submitted and emails sent successfully",
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return c.json(
      {
        success: false,
        message: "An internal error occurred",
      },
      500
    );
  }
});

// Fashion Chatbot API
app.post("/api/chatbot", async (c) => {
  try {
    const { message } = await c.req.json();
    
    if (!message) {
      return c.json({ error: "Message is required" }, 400);
    }

    // Use HeyBoss AI API for fashion-focused responses
    const response = await fetch('https://api.heybossai.com/v1/run', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${c.env.API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        inputs: {
          system_prompt: `You are a fashion expert AI assistant for NYUThrowingAFit, a bold NYC-based fashion brand. Your personality is confident, trendy, and street-smart. You help users with:
          
          - Fashion advice and styling tips
          - Outfit coordination and color matching
          - Trend insights and street style
          - Shopping recommendations
          - Fashion history and cultural context
          - Personal style development
          
          Keep responses concise (2-3 sentences max), use a confident tone, and occasionally use fashion slang or NYC references. If asked about non-fashion topics, redirect back to style and fashion. Always be encouraging about personal expression through fashion.`,
          user_prompt: message
        }
      })
    });

    if (!response.ok) {
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    
    return c.json({
      response: data.response || "I'm here to help you elevate your style game! Ask me about fashion trends, outfit ideas, or styling tips! 🔥"
    });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return c.json({
      response: "Hey! I'm your fashion assistant. Ask me about the latest trends, how to style your fits, or what's hot in NYC street fashion right now! 💫"
    });
  }
});

export default app;





