import { User, UserLevel } from '@natsuki/db'
import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { TYPES } from '../constants'
import { Logger } from '../utility'

/**
 * User service that handles storing and modifying user data.
 *
 * @export
 * @class UserService
 */
@provide(TYPES.UserService)
export class UserService {
  private userRepository = getRepository(User)
  private userLevelRepository = getRepository(UserLevel)

  public getUsers () {
    return this.userRepository.find()
  }

  public async getUser (id: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.level', 'level')
      .where('user.id = :id', { id })
      .getOne()
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
    // TODO: Fix this when TypeORM makes a Stable Release that fixes the Cascades.

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.level', 'level')
      .where('user.id = :id', { id })
      .getOne()

    if (!user) {
      return
    }

    const level = user.level
    level.xp = userLevel.xp
    level.level = userLevel.level

    return this.userLevelRepository.updateById(level.id, level)
  }
}
