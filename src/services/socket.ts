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
  private socket: SocketIO.Server
  constructor () {
    this.socket = getSocketServer()
  }

  public send (event: symbol, ...content: any[]) {
    this.socket.sockets.emit(event, ...content)
  }
}
