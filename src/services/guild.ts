// TODO: Replace with Guild models
import { Guild, GuildSuggestion } from '@natsuki/db'
import { getRepository, getConnection } from 'typeorm'
import { provide } from '../ioc/ioc'
import { Types } from '../constants'
import { Logger } from '../utilities'
import { BaseService } from '../interfaces/BaseService'

/**
 * Guild service that handles storing and modifying guild data
 *
 * @class GuildService
 */
@provide(Types.GuildService)
export class GuildService implements BaseService<Guild> {
  private guildRepository = getRepository(Guild)
  private suggestionRepository = getRepository(GuildSuggestion)

  public getAll () {
    return this.guildRepository.find()
  }

  public async findById (id: string | number) {
    return this.guildRepository
      .createQueryBuilder('guild')
      .innerJoinAndSelect('guild.settings', 'settings')
      .innerJoinAndSelect('guild.suggestions', 'suggestions')
      .where('guild.id = :id', { id })
      .getOne()
  }

  public create (guild: Guild) {
    guild.dateCreated = new Date()
    return this.guildRepository.save(guild)
  }

  public updateById (id: string | number, guild: Guild) {
    return this.guildRepository.updateById(id, guild)
  }

  public deleteById (id: string | number) {
    return this.guildRepository.deleteById(id)
  }

  public getSuggestions (id: string) {
    return this.guildRepository.createQueryBuilder('guildSuggestion')
      .where('guildSuggestion.guildId = :id', { id })
      .execute()
  }

  public getSuggestionById (id: string, suggestionId: string) {
    return this.suggestionRepository.findOneById(suggestionId)
  }

  public createSuggestion (id: string, suggestion: GuildSuggestion) {
    suggestion.dateCreated = new Date()
    return this.suggestionRepository.save(suggestion)
  }

  public deleteSuggestion (id: string, suggestionId: string) {
    return this.suggestionRepository.deleteById(suggestionId)
  }

  public updateSuggestion (id: string, suggestion: GuildSuggestion) {
    return this.suggestionRepository.updateById(suggestion.id, suggestion)
  }
}
