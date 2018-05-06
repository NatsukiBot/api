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
    return this.userRepository.updateById(id, user)
  }

  public deleteById (id: string | number) {
    return this.userRepository.deleteById(id)
  }

  public async updateLevel (id: string, userLevelBalance: UserLevelBalance) {
    // TODO: Fix this when TypeORM makes a Stable Release that fixes the Cascades.

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.level', 'level')
      .leftJoinAndSelect('user.balance', 'balance')
      .where('user.id = :id', { id })
      .getOne()

    if (!user) {
      return
    }

    const userLevel = userLevelBalance.level
    const userBalance = userLevelBalance.balance

    const level = user.level
    level.xp = userLevel.xp
    level.level = userLevel.level
    level.timestamp = new Date()

    const balance = user.balance

    if (userBalance) {
      balance.balance = userBalance.balance
      balance.netWorth = userBalance.netWorth
    }

    this.userBalanceRepository.updateById(balance.id, balance)
    return this.userLevelRepository.updateById(level.id, level)
  }

  public async updateBalance (id: string, userBalance: UserBalance) {
    // TODO: Fix this when TypeORM makes a Stable Release that fixes the Cascades.

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.balance', 'balance')
      .where('user.id = :id', { id })
      .getOne()

    if (!user) {
      return
    }

    const balance = user.balance

    balance.balance = userBalance.balance
    balance.netWorth = userBalance.netWorth
    balance.dateLastClaimedDailies = userBalance.dateLastClaimedDailies

    return this.userBalanceRepository.updateById(balance.id, balance)
  }

  public async updateProfile (id: string, userProfile: UserProfile) {
    // TODO: Fix this when TypeORM makes a Stable Release that fixes the Cascades.

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id })
      .getOne()

    if (!user) {
      return
    }

    const profile = user.profile

    profile.background = userProfile.background
    profile.bio = userProfile.bio
    profile.title = userProfile.title

    return this.userBalanceRepository.updateById(profile.id, profile)
  }
}
