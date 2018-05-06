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
  private userLevelRepository = getRepository(UserLevel)
  private userBalanceRepository = getRepository(UserBalance)

  public getAll () {
    return this.userRepository.find()
  }

  public async findById (id: string | number) {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.level', 'level')
      .innerJoinAndSelect('user.settings', 'settings')
      .innerJoinAndSelect('user.balance', 'balance')
      .innerJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id })
      .getOne()
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
    userLevelBalance.level.timestamp = new Date()

    if (userLevelBalance.balance) {
      this.userBalanceRepository.save(userLevelBalance.balance)
    }

    return this.userLevelRepository.save(userLevelBalance.level)
  }

  public async updateBalance (id: string, userBalance: UserBalance) {
    return this.userBalanceRepository.save(userBalance)
  }

  public async updateProfile (id: string, userProfile: UserProfile) {
    return this.userBalanceRepository.save(userProfile)
  }
}
