export const Events = {
  user: {
    created: Symbol('userCreated'),
    deleted: Symbol('userDeleted'),
    updated: Symbol('userUpdated'),
    levelUpdated: Symbol('userLevelUpdated'),
    levelIncreased: Symbol('userLevelIncreased')
  },
  guild: {
    created: Symbol('guildCreated'),
    deleted: Symbol('guildDeleted'),
    updated: Symbol('guildUpdated')
  }
}
