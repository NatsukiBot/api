import { Api } from './api'
import { config } from './config'

const debug = require('debug')('express:server')

export const server = Api.start().app
const port = process.env.PORT || config.port
server.listen(port, (err) => {
  if (err) {
    throw err
  }

  console.log(`Express server listening on port ${port}`)
})
