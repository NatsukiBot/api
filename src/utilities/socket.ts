import * as socketIo from 'socket.io'

let io: SocketIO.Server

export function init (server: SocketIO.Server) {
  io = server

  io.on('connection', (client) => {
    client.emit('debug', 'Successfully connected to the API')
  })
}

export function getSocketServer () {
  return io
}
