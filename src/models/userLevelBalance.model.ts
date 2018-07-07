import { UserBalance, UserLevel } from '@nightwatch/db'

export interface UserLevelBalance {
  level: UserLevel
  balance?: UserBalance
}
