import { type Request } from 'express';

export interface IRequest extends Request {
    user?: {
        id: string;
        email: string;
        role?: string;
    };
}