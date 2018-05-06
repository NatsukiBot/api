export const Events = {
  user: {
    created: 'userCreated',
    deleted: 'userDeleted',
    updated: 'userUpdated',
    levelUpdated: 'userLevelUpdated',
    balanceUpdated: 'userBalanceUpdated',
    profileUpdated: 'userProfileUpdated'
  },
  guild: {
    created: 'guildCreated',
    deleted: 'guildDeleted',
    updated: 'guildUpdated',
    suggestion: {
      created: 'guildSuggestionCreated',
      updated: 'guildSuggestionUpdated',
      deleted: 'guildSuggestionDeleted'
    },
    supportTicket: {
      created: 'guildSupportTicketCreated',
      updated: 'guildSupportTicketUpdated',
      deleted: 'guildSupportTicketDeleted'
    }
  },
  giveaway: {
    created: 'giveawayCreated',
    deleted: 'giveawayCreated',
    updated: 'giveawayCreated'
  },
  referral: {
    created: 'referralCreated',
    deleted: 'referralDeleted',
    updated: 'referralUpdated'
  },
  info: 'info'
}
