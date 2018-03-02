import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { User, UserLevel } from '@natsuki/db'

export class UserController {
  // private userRepository = getRepository(User)

  async all (request: Request, response: Response, next: NextFunction) {
    return User.find()
  }

  async one (request: Request, response: Response, next: NextFunction) {
    return User.findOneById(request.params.id)
  }

  async save (request: Request, response: Response, next: NextFunction) {
    return User.save(request.body)
  }

  async remove (request: Request, response: Response, next: NextFunction) {
    await User.removeById(request.params.id)
  }

  async updateLevel (request: Request, response: Response, next: NextFunction) {
    await UserLevel.updateById(request.params.id, request.body)
  }
}
