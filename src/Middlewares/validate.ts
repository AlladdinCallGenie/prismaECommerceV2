import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseBody = await schema.parseAsync(req.body);
      req.body = parseBody;
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
  };
// const secret = crypto.randomBytes(32).toString('base64');
