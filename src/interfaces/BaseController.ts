import { Request, Response } from 'express'

export interface BaseController<T, IDColumnType> {
  getAll: (request: Request, response: Response) => Promise<T[]>
  findById: (id: IDColumnType, request: Request, response: Response) => Promise<T | undefined>
  create: (request: Request, response: Response) => Promise<T>
  updateById: (id: IDColumnType, request: Request, response: Response) => Promise<T>
  deleteById: (id: IDColumnType, request: Request, response: Response) => Promise<T | undefined>
}
