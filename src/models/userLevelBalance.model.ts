import { UserBalance, UserLevel } from '@natsuki/db'

export interface UserLevelBalance {
  level: UserLevel
  balance?: UserBalance
}
