import { Request, Response } from 'express';

export interface BaseController<T> {
  getAll: (request: Request, response: Response) => Promise<T[]>;
  findById: (request: Request, response: Response) => Promise<T | undefined>;
  create: (request: Request, response: Response) => Promise<T>;
  updateById: (request: Request, response: Response) => Promise<T>;
  deleteById: (request: Request, response: Response) => Promise<T | undefined>;
}
