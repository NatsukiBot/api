import { Guild, GuildSuggestion, GuildSupportTicket, GuildSettings, GuildUser } from '@nightwatch/db'
import { getRepository } from 'typeorm'
import { BaseService } from '../interfaces/BaseService'
import { injectable } from 'inversify'

/**
 * Guild service that handles storing and modifying guild data
 *
 * @class GuildService
 */
@injectable()
export class GuildService implements BaseService<Guild> {
  private guildRepository = getRepository(Guild)
  private suggestionRepository = getRepository(GuildSuggestion)
  private supportTicketRepository = getRepository(GuildSupportTicket)
  private settingsRepository = getRepository(GuildSettings)
  private userRepository = getRepository(GuildUser)

  public getAll () {
    return this.guildRepository.find()
  }

  public async findById (id: string | number) {
    return this.guildRepository.findOne(id, {
      relations: [ 'settings', 'suggestions', 'supportTickets' ]
    })
  }

  public create (guild: Guild) {
    guild.dateCreated = new Date()
    return this.guildRepository.save(guild)
  }

  public update (id: string | number, guild: Guild) {
    return this.guildRepository.save(guild)
  }

  public async delete (id: string | number) {
    const guild = await this.guildRepository.findOne(id)

    if (!guild) {
      return
    }

    return this.guildRepository.remove(guild)
  }

  public getSuggestions (id: string) {
    return this.suggestionRepository.find({ where: { guildId: id } })
  }

  public getSuggestionById (id: string, suggestionId: number) {
    return this.suggestionRepository.findOne(suggestionId)
  }

  public createSuggestion (id: string, suggestion: GuildSuggestion) {
    suggestion.dateCreated = new Date()
    return this.suggestionRepository.save(suggestion)
  }

  public async deleteSuggestion (id: string, suggestionId: number) {
    const suggestion = await this.suggestionRepository.findOne(suggestionId)

    if (!suggestion) {
      return
    }

    return this.suggestionRepository.remove(suggestion)
  }

  public async updateSuggestion (id: string, suggestionId: number | string, suggestion: GuildSuggestion) {
    return this.suggestionRepository.update(suggestionId, suggestion)
  }

  public getSupportTickets (id: string) {
    return this.supportTicketRepository.find({ where: { guild: { id } } })
  }

  public getSupportTicketById (id: string, ticketId: number) {
    return this.supportTicketRepository.findOne(ticketId)
  }

  public createSupportTicket (id: string, supportTicket: GuildSupportTicket) {
    supportTicket.dateCreated = new Date()
    return this.supportTicketRepository.save(supportTicket)
  }

  public async deleteSupportTicket (id: string, ticketId: number) {
    const ticket = await this.supportTicketRepository.findOne(ticketId)

    if (!ticket) {
      return
    }

    return this.supportTicketRepository.remove(ticket)
  }

  public async updateSupportTicket (id: string, ticketId: number | string, supportTicket: GuildSupportTicket) {
    return this.supportTicketRepository.update(ticketId, supportTicket)
  }

  public async getSettings (id: string) {
    return this.settingsRepository.find({ where: { guild: { id } } })
  }

  public async updateSettings (id: string, settings: GuildSettings) {
    return this.settingsRepository.update({ guild: { id } }, settings)
  }

  public async getUsers (id: string) {
    return this.userRepository.find({ where: { guild: { id } } })
  }

  public getUserById (id: string, userId: string) {
    return this.userRepository.findOne({
      where: { guild: { id }, user: { id: userId } }
    })
  }

  public async createUser (id: string, user: GuildUser) {
    user.dateJoined = new Date()
    return this.userRepository.save(user)
  }

  public async deleteUser (id: string, userId: string) {
    const user = await this.userRepository.findOne({
      where: { guild: { id }, user: { id: userId } }
    })

    if (!user) {
      return
    }

    return this.userRepository.remove(user)
  }

  public async updateUser (id: string, userId: string, user: GuildUser) {
    return this.userRepository.update({ guild: { id }, user: { id: userId } }, user)
  }
}
