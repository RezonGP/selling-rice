import { mysqlPool } from '../../config/mysql';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class ProductRepositoryMySQL {
  // 1. Lấy danh sách sản phẩm bằng MySQL2 (Raw SQL)
  async findAll(filter: { category?: string; search?: string }) {
    let sql = 'SELECT * FROM products WHERE is_active = 1';
    const params: any[] = [];

    if (filter.category) {
      sql += ' AND category = ?';
      params.push(filter.category);
    }
    if (filter.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filter.search}%`, `%${filter.search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await mysqlPool.query<RowDataPacket[]>(sql, params);
    return rows;
  }

  // 2. Lấy chi tiết gạo bằng Slug
  async findBySlug(slug: string) {
    const sql = 'SELECT * FROM products WHERE slug = ? AND is_active = 1 LIMIT 1';
    const [rows] = await mysqlPool.query<RowDataPacket[]>(sql, [slug.toLowerCase()]);
    return rows.length > 0 ? rows[0] : null;
  }

  // 3. Thêm mới gạo bằng SQL INSERT INTO
  async create(productData: any) {
    const sql = `
      INSERT INTO products (code, name, slug, category, description, images, characteristics, packaging_options, is_featured, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    const params = [
      productData.code,
      productData.name,
      productData.slug,
      productData.category,
      productData.description,
      JSON.stringify(productData.images || []),
      JSON.stringify(productData.characteristics || {}),
      JSON.stringify(productData.packagingOptions || []),
      productData.isFeatured ? 1 : 0,
    ];

    const [result] = await mysqlPool.query<ResultSetHeader>(sql, params);
    return { id: result.insertId, ...productData };
  }
}
