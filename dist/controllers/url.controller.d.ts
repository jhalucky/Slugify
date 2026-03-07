import { Request, Response } from 'express';
export declare const createUrl: (req: Request, res: Response) => Promise<void>;
export declare const redirectUrl: (req: Request, res: Response) => Promise<void>;
export declare const getUserUrls: (req: Request, res: Response) => Promise<void>;
export declare const deleteUrl: (req: Request, res: Response) => Promise<void>;
