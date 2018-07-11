import { User, UserBalance, UserLevel, UserProfile, UserSettings, UserFriend, UserFriendRequest } from '@nightwatch/db'
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
  private userFriendRepository = getRepository(UserFriend)
  private userFriendRequestRepository = getRepository(UserFriendRequest)

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
    return this.userProfileRepository.findOne({ where: { user: { id } } })
  }

  public async updateProfile (id: string, userProfile: UserProfile) {
    return this.userProfileRepository.update({ user: { id } }, userProfile)
  }

  public async updateSettings (id: string, userSettings: UserSettings) {
    return this.userSettingsRepository.update({ user: { id } }, userSettings)
  }

  public async getSettings (id: string) {
    return this.userSettingsRepository.findOne({ where: { user: { id } } })
  }

  public async getFriendRequests (id: string, type?: 'incoming' | 'outgoing') {
    const requestsMap = new Map<'incoming' | 'outgoing', UserFriendRequest[]>()

    if (!type || type === 'incoming') {
      const requests = await this.userFriendRequestRepository.find({ where: { receiver: { id } } })
      requestsMap.set('incoming', requests)

      if (type) {
        return requestsMap
      }
    }

    const requests = await this.userFriendRequestRepository.find({ where: { user: { id } } })
    requestsMap.set('outgoing', requests)

    return requestsMap
  }

  public async searchFriendRequests (id: string, skip: number = 0, take: number = 10) {
    return this.userFriendRequestRepository.find({
      skip,
      take
    })
  }

  public async createFriendRequest (id: string, friendRequest: UserFriendRequest) {
    // Creating a friend request is a two step process:
    // 1) Check if other user already sent a friend request.
    //    This is a completely valid and possible scenario.
    // 2) Save the friend request object.
    const existingFriendRequest = await this.userFriendRequestRepository.findOne({
      where: { user: { id: friendRequest.user.id }, friend: { id } }
    })

    if (existingFriendRequest) {
      return
    }

    return this.userFriendRequestRepository.save(friendRequest)
  }

  public async deleteFriendRequest (id: string, requestId: number) {
    const friendRequest = await this.userFriendRequestRepository.findOne({
      where: { id: requestId }
    })

    if (!friendRequest) {
      return
    }

    return this.userFriendRequestRepository.remove(friendRequest)
  }

  public async getFriends (id: string) {
    const results: UserFriend[] = []
    const friends = await this.userFriendRepository.find({ where: { user: { id } } })
    const otherFriends = await this.userFriendRepository.find({ where: { friend: { id } } })

    return results.concat(friends, otherFriends)
  }

  public async searchFriends (id: string, skip: number = 0, take: number = 10) {
    return this.userFriendRepository.find({
      skip,
      take
    })
  }

  public async getFriendById (id: string, friendId: number) {
    return this.userFriendRepository.findOne(friendId)
  }

  public async addFriend (id: string, friend: UserFriend) {
    // Adding a friend consists of three steps:
    // 1) Delete the existing friend request, assuming it exists.
    //    The developer shouldn't manually delete an accepted friend request, only denied ones.
    // 2) Check if the other user already added them as a friend
    //    If this is true, then the developer is probably doing something wrong.
    // 3) Save the friend object.
    let friendRequest = await this.userFriendRequestRepository.findOne({
      where: { receiver: { id }, user: { id: friend.user.id } }
    })

    if (!friendRequest) {
      friendRequest = await this.userFriendRequestRepository.findOne({
        where: { receiver: { id: friend.user.id }, user: { id } }
      })
    }

    if (friendRequest) {
      await this.userFriendRequestRepository.remove(friendRequest)
    }

    const existingFriend = await this.userFriendRepository.findOne({
      where: { user: { id: friend.user.id }, friend: { id } }
    })

    if (existingFriend) {
      return
    }

    return this.userFriendRepository.save(friend)
  }

  public async deleteFriend (id: string, friendId: number) {
    const friend = await this.userFriendRepository.findOne(friendId)

    if (!friend) {
      return
    }

    return this.userFriendRepository.remove(friend)
  }
}
