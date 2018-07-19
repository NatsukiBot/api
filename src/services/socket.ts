import { getSocketServer } from '../utilities'
import { injectable } from 'inversify'

/**
 * Socket service for emitting live updates to clients.
 *
 * @class SocketService
 */
@injectable()
export class SocketService {
  public send (event: string, content: any) {
    getSocketServer().emit(event, content)
  }
}
