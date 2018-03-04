import { User, UserLevel } from '@natsuki/db'
import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { TYPES } from '../constants'
import { Logger } from '../utility'

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
    return this.userRepository.save(user)
  }

  public update (id: string, user: User) {
    return this.userRepository.updateById(id, user)
  }

  public delete (id: string) {
    return this.userRepository.deleteById(id)
  }

  public async updateLevel (id: string, userLevel: UserLevel) {
    // TODO: Fix this when TypeORM makes a Stable Release that fixes the Cascades. This is slow as-is.

    const user: User = await getConnection()
      .createQueryBuilder()
      .leftJoinAndSelect('user.level', 'level')
      .where('user.id = :id', { id })
      .getOne()

    const level = user.level
    level.xp = userLevel.xp
    level.level = userLevel.level

    this.userLevelRepository.save(level)
  }
}
