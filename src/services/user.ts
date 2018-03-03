import { User, UserLevel } from '@natsuki/db'
import { getRepository } from 'typeorm'
import { provide } from '../ioc/ioc'
import { TYPES } from '../constants'

@provide(TYPES.UserService)
export class UserService {
  private userRepository = getRepository(User)

  public getUsers () {
    return this.userRepository.find()
  }

  public getUser (id: string) {
    return this.userRepository.findOneById(id)
  }

  public create (user: User) {
    return this.userRepository.save(user)
  }

  public update (id: string, user: User) {
    return this.userRepository.updateById(id, user)
  }

  public delete (id: string) {
    return this.userRepository.deleteById(id)
  }

  public async updateLevel (id: string, userLevel: UserLevel) {
    const user = await this.userRepository.findOneById(id)

    if (!user) {
      return
    }

    user.level = userLevel

    this.userRepository.save(user)
  }
}
