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
    const newUser = this.userRepository.create(user)
    return this.userRepository.save(newUser)
  }

  public update (id: string, user: User) {
    return this.userRepository.updateById(id, user)
  }

  public delete (id: string) {
    return this.userRepository.deleteById(id)
  }

  public updateLevel (id: string, userLevel: UserLevel) {
    return this.userRepository.findOneById(id).then(user => {
      if (!user) {
        return
      }

      user.level = userLevel

      this.userRepository.save(user)
    })
  }
}
