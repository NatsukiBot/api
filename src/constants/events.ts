export const Events = {
  user: {
    created: 'userCreated',
    deleted: 'userDeleted',
    updated: 'userUpdated',
    levelUpdated: 'userLevelUpdated',
    balanceUpdated: 'userBalanceUpdated'
  },
  guild: {
    created: 'guildCreated',
    deleted: 'guildDeleted',
    updated: 'guildUpdated',
    suggestion: {
      created: 'guildSuggestionCreated',
      updated: 'guildSuggestionUpdated',
      deleted: 'guildSuggestionDeleted'
    }
  },
  referral: {
    created: 'referralCreated',
    deleted: 'referralDeleted',
    updated: 'referralUpdated'
  },
  info: 'info'
}
