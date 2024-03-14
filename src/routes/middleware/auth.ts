import { Request, Response, NextFunction } from "express";

export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationKey = req.headers?.authorization;
  if (authorizationKey === process.env.apiAccess) {
    return next();
  } else {
    return res.unauthorized({});
  }
};
