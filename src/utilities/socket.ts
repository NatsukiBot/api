import * as socketIo from 'socket.io'

let server: SocketIO.Server

export function init (io: SocketIO.Server) {
  server = io
}

export function getSocketServer () {
  return server
}
