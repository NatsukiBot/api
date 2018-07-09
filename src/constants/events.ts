export const Events = {
  user: {
    created: 'userCreated',
    deleted: 'userDeleted',
    updated: 'userUpdated',
    levelUpdated: 'userLevelUpdated',
    balanceUpdated: 'userBalanceUpdated',
    profileUpdated: 'userProfileUpdated',
    settingsUpdated: 'userSettingsUpdated'
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
    },
    settingsUpdated: 'guildSettingsUpdated',
    user: {
      created: 'guildUserCreated',
      deleted: 'guildUserDeleted',
      updated: 'guildUserUpdated'
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
