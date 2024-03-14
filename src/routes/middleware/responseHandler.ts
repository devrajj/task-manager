import { Request, Response, NextFunction } from "express";

export default (_req: Request, res: Response, next: NextFunction) => {
  res.invalid = (payload: Express.Payload) =>
    res.status(200).json({
      ok: false,
      err: payload.msg || "Invalid Parameters",
      code: payload.code,
      data: null,
    });

  res.failure = (payload: Express.Payload) =>
    res.status(200).json({
      ok: false,
      err: payload.msg || "Something is wrong! We're looking into it.",
      code: payload.code,
      data: null,
    });

  res.unauthorized = (payload: Express.Payload) =>
    res.status(401).json({
      ok: false,
      err: payload.msg || "Authentication Failed",
      data: null,
    });

  res.success = ({ data = {} }) =>
    res.status(200).json({ ok: true, err: null, data });

  next();
};
