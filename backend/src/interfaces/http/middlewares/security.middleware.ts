import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';
import { Request, Response, NextFunction } from 'express';

export const helmetSecurity = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'blob:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

export const mongoSanitizer = mongoSanitize();

export const xssSanitizer = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = JSON.parse(xss(JSON.stringify(req.body)));
  }
  if (req.query) {
    req.query = JSON.parse(xss(JSON.stringify(req.query)));
  }
  if (req.params) {
    req.params = JSON.parse(xss(JSON.stringify(req.params)));
  }
  next();
};
