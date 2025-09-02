import { User } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      user?: User | null; // Optional so TS doesn't complain if it's not set
    }
  }
}
