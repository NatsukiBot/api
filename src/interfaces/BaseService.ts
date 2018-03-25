import { Request, Response } from 'express'

export interface BaseService<T> {
  getAll: () => Promise<T[]>
  findById: (id: string | number) => Promise<T | undefined>
  create: (model: T) => Promise<T>
  updateById: (id: string, model: T) => Promise<void>
  deleteById: (id: string | number) => Promise<void>

}
