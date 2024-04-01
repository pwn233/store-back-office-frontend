import { ISODateString } from "next-auth";

export interface JWTSession {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    access_token?: string | null;
  };
  expires: ISODateString;
}
