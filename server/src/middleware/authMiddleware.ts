import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

const JWKS = createRemoteJWKSet(new URL(process.env.JWKS_URL as string));

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Missing or invalid Authorization header format." });
  }

  const token = authHeader.split(' ')[1].trim();

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ["EdDSA", "RS256", "ES256"],
    });

    req.userId = payload.sub as string;
    req.user = payload;
    next();

  } catch (err: any) {
    next(err)
  }
}
