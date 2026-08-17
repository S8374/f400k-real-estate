import { JwtPayload } from "jsonwebtoken";
export declare const generateToken: (payload: JwtPayload, secret: string, expiresIn: string) => any;
export declare const verifyToken: (token: string, secret: string) => any;
