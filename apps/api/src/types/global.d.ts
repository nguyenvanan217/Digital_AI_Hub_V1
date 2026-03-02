import { JwtPayload } from '../middleware/jwtAction';
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      token?: string;
    }
  }
}