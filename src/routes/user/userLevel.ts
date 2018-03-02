import { UserController } from '../../controller/UserController'

export const UserLevelRoutes = [{
  method: 'put',
  route: '/users/:id/levels',
  controller: UserController,
  action: 'updateLevel'
}]
