// TODO: Replace with Guild models
import { Guild, GuildSuggestion, GuildSupportTicket } from '@natsuki/db';
import { getRepository } from 'typeorm';
import { provide } from '../ioc/ioc';
import { Types } from '../constants';
import { Logger } from '@natsuki/util';
import { BaseService } from '../interfaces/BaseService';

/**
 * Guild service that handles storing and modifying guild data
 *
 * @class GuildService
 */
@provide(Types.GuildService)
export class GuildService implements BaseService<Guild> {
  private guildRepository = getRepository(Guild);
  private suggestionRepository = getRepository(GuildSuggestion);
  private supportTicketRepository = getRepository(GuildSupportTicket);

  public getAll() {
    return this.guildRepository.find();
  }

  public async findById(id: string | number) {
    return this.guildRepository.findOne(id, {
      relations: ['settings', 'suggestions', 'supportTickets']
    });
  }

  public create(guild: Guild) {
    guild.dateCreated = new Date();
    return this.guildRepository.save(guild);
  }

  public update(id: string | number, guild: Guild) {
    return this.guildRepository.save(guild);
  }

  public async delete(id: string | number) {
    const guild = await this.guildRepository.findOne(id);

    if (!guild) {
      return;
    }

    return this.guildRepository.remove(guild);
  }

  public getSuggestions(id: string) {
    return this.suggestionRepository.find({ where: { guildId: id } });
  }

  public getSuggestionById(id: string, suggestionId: number) {
    return this.suggestionRepository.findOne(suggestionId);
  }

  public createSuggestion(id: string, suggestion: GuildSuggestion) {
    suggestion.dateCreated = new Date();
    return this.suggestionRepository.save(suggestion);
  }

  public async deleteSuggestion(id: string, suggestionId: number) {
    const suggestion = await this.suggestionRepository.findOne(id);

    if (!suggestion) {
      return;
    }

    return this.suggestionRepository.remove(suggestion);
  }

  public async updateSuggestion(
    id: string,
    suggestionId: number | string,
    suggestion: GuildSuggestion
  ) {
    return this.suggestionRepository.update(suggestionId, suggestion);
  }

  public getSupportTickets(id: string) {
    return this.supportTicketRepository.find({ where: { guildId: id } });
  }

  public getSupportTicketById(id: string, ticketId: number) {
    return this.supportTicketRepository.findOne(ticketId);
  }

  public createSupportTicket(id: string, supportTicket: GuildSupportTicket) {
    supportTicket.dateCreated = new Date();
    return this.supportTicketRepository.save(supportTicket);
  }

  public async deleteSupportTicket(id: string, ticketId: number) {
    const ticket = await this.supportTicketRepository.findOne(ticketId);

    if (!ticket) {
      return;
    }

    this.supportTicketRepository.remove(ticket);
  }

  public async updateSupportTicket(
    id: string,
    ticketId: number | string,
    supportTicket: GuildSupportTicket
  ) {
    return this.supportTicketRepository.update(ticketId, supportTicket);
  }
}
