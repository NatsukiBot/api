import { provide } from '../ioc/ioc'
import { Types } from '../constants'
import axios from 'axios'

const { clientSecret, clientId } = require('../../api.json').bot

/**
 * Authentication service to handle authentication through Discord and web interface.
 *
 * @class AuthenticationService
 */
@provide(Types.AuthenticationService)
export class AuthenticationService {
  public async getDiscordAccessToken (code: string, redirect: string) {
    const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const response = await axios.post(
      `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      null,
      { headers: { Authorization: `Basic ${creds}` } }
    )

    return response.data
  }
}
