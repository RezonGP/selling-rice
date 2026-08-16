import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../../../application/services/ProductService';
import { RiceCategory } from '../../../domain/entities/types';

const productService = new ProductService();

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, isFeatured, search } = req.query;
      const products = await productService.getAllProducts({
        category: category as RiceCategory,
        isFeatured: isFeatured ? isFeatured === 'true' : undefined,
        search: search as string,
      });
      return res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      return res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await productService.deleteProduct(req.params.id);
      return res.status(200).json({ success, message: 'Product marked inactive' });
    } catch (error) {
      next(error);
    }
  }
}
