import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../config/logger';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled Error caught in middleware', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Zod validation errors (from validateBody middleware)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: err.errors?.map((e: any) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Lỗi xác thực dữ liệu: ' + Object.values(err.errors).map((e: any) => e.message).join(', '),
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Giá trị không hợp lệ cho trường ${err.path}: ${err.value}`,
    });
  }

  // MongoDB duplicate key (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Dữ liệu đã tồn tại: ${field} "${err.keyValue?.[field]}" đã được đăng ký.`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
  }

  // CORS errors
  if (err.message?.startsWith('CORS:')) {
    return res.status(403).json({ success: false, message: err.message });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.' : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
