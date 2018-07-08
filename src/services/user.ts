import { User, UserBalance, UserLevel, UserProfile, UserSettings } from '@nightwatch/db'
import { getRepository } from 'typeorm'
import { provide } from '../ioc/ioc'
import { Types } from '../constants'
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
  private userBalanceRepository = getRepository(UserBalance)
  private userLevelRepository = getRepository(UserLevel)
  private userProfileRepository = getRepository(UserProfile)
  private userSettingsRepository = getRepository(UserSettings)

  public getAll () {
    return this.userRepository.find()
  }

  public async findById (id: string | number) {
    return this.userRepository.findOne(id, {
      relations: [ 'level', 'settings', 'balance', 'profile' ]
    })
  }

  public create (user: User) {
    user.dateCreated = new Date()
    return this.userRepository.save(user)
  }

  public update (id: string | number, user: User) {
    return this.userRepository.save(user)
  }

  public async delete (id: string | number) {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      return
    }

    return this.userRepository.remove(user)
  }

  public async updateLevel (id: string, userLevelBalance: UserLevelBalance) {
    const user = await this.userRepository.findOne(id, {
      relations: [ 'level', 'balance' ]
    })

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
    return this.userBalanceRepository.update({ user: { id } }, userBalance)
  }

  public async getProfile (id: string) {
    return this.userProfileRepository.find({ where: { user: { id } } })
  }

  public async updateProfile (id: string, userProfile: UserProfile) {
    return this.userProfileRepository.update({ user: { id } }, userProfile)
  }

  public async updateSettings (id: string, userSettings: UserSettings) {
    return this.userSettingsRepository.update({ user: { id } }, userSettings)
  }

  public async getSettings (id: string) {
    return this.userSettingsRepository.find({ where: { user: { id } } })
  }
}
