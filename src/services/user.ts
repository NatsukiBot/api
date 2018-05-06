import { User, UserBalance, UserLevel, UserProfile } from '@natsuki/db'
import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { Types } from '../constants'
import { Logger } from '../utilities'
import { BaseService } from '../interfaces/BaseService'
import { UserLevelBalance } from '../models/userLevelBalance.model'

/**
 * User service that handles storing and modifying user data.
 *
 * @class UserService
 */
@provide(Types.UserService)
export class UserService implements BaseService<User> {
  private userRepository = getRepository(User)

  public getAll () {
    return this.userRepository.find()
  }

  public async findById (id: string | number) {
    return this.userRepository.findOne(id, { relations: ['level', 'settings', 'balance', 'profile'] })
  }

  public create (user: User) {
    user.dateCreated = new Date()
    return this.userRepository.save(user)
  }

  public updateById (id: string | number, user: User) {
    return this.userRepository.save(user)
  }

  public async deleteById (id: string | number) {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      return
    }

    return this.userRepository.remove(user)
  }

  public async updateLevel (id: string, userLevelBalance: UserLevelBalance) {
    const user = await this.userRepository.findOne(id, { relations: ['level', 'balance'] })

    if (!user) {
      return
    }

    const { balance, level } = userLevelBalance

    user.level.timestamp = new Date()
    user.level.level = level.level
    user.level.xp = level.xp

    if (balance) {
      user.balance.balance = balance.balance
      user.balance.netWorth = balance.netWorth
    }

    return this.userRepository.save(user)
  }

  public async updateBalance (id: string, userBalance: UserBalance) {
    const user = await this.userRepository.findOne(id, { relations: ['balance'] })

    if (!user) {
      return
    }

    user.balance = userBalance

    return this.userRepository.save(user)
  }

  public async updateProfile (id: string, userProfile: UserProfile) {
    const user = await this.userRepository.findOne(id, { relations: ['profile'] })

    if (!user) {
      return
    }

    user.profile = userProfile

    return this.userRepository.save(user)
  }
}
