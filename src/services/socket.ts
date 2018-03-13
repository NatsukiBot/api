import { provide } from '../ioc/ioc'
import { Types } from '../constants'
import { getSocketServer } from '../utilities'

/**
 * Socket service for emitting live updates to clients.
 *
 * @export
 * @class SocketService
 */
@provide(Types.SocketService)
export class SocketService {
  public send (event: string, content: any) {
    getSocketServer().emit(event, content)
  }
}
