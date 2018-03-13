import * as socketIo from 'socket.io'
import { Events } from '../constants'

let io: SocketIO.Server

export function init (server: SocketIO.Server) {
  io = server

  io.on('connection', (client) => {
    client.emit(Events.info, 'Successfully connected to the API')
  })
}

export function getSocketServer () {
  return io
}
