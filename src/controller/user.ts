import { Request } from 'express'
import { controller, httpGet, httpDelete, httpPut, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../constants'
import { UserService } from '../services/user'

@controller('/api/users')
export class UserController {
  constructor (@inject(TYPES.UserService) private userService: UserService) {}

  @httpGet('/')
  async all (request: Request) {
    return this.userService.getUsers()
  }

  @httpGet('/:id')
  async one (request: Request) {
    return this.userService.getUser(request.params.id)
  }

  @httpPost('/')
  async save (request: Request) {
    return this.userService.create(request.body)
  }

  @httpDelete('/:id')
  async remove (request: Request) {
    return this.userService.delete(request.params.id)
  }

  @httpPut('/:id')
  async update (request: Request) {
    return this.userService.update(request.params.id, request.body)
  }

  @httpPut('/:id/level')
  async updateLevel (request: Request) {
    return this.userService.updateLevel(request.params.id, request.body)
  }
}
