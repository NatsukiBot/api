import { User, UserLevel } from '@natsuki/db'
import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { TYPES } from '../constants'

@provide(TYPES.UserService)
export class UserService {
  private userRepository = getRepository(User)
  private userLevelRepository = getRepository(UserLevel)

  public getUsers () {
    return this.userRepository.find()
  }

  public getUser (id: string) {
    return this.userRepository.findOneById(id)
  }

  public create (user: User) {
    this.userRepository.save(user)
  }

  public update (id: string, user: User) {
    return this.userRepository.updateById(id, user)
  }

  public delete (id: string) {
    return this.userRepository.deleteById(id)
  }

  public async updateLevel (id: string, userLevel: UserLevel) {
    const foundUserLevel = await this.userLevelRepository.findOne({ where: { userId: id } })

    if (!foundUserLevel) {
      return
    }

    foundUserLevel.level = userLevel.level
    foundUserLevel.xp = userLevel.xp

    return this.userLevelRepository.save(foundUserLevel)
  }
}
