/* tslint:disable:no-unused-expression */

import 'reflect-metadata'
import 'mocha'
import { assert } from 'chai'
import { UserController } from '../../src/controllers/user'
import { UserService } from '../../src/services/user'
import { createTestDatabaseConnection } from '..'
import {
  User,
  UserVerification,
  UserSettings,
  UserReputation,
  UserProfile,
  UserLevel,
  UserBalance
} from '@nightwatch/db'
import { getRepository, getConnection } from 'typeorm'
import { Request } from 'express'

describe('UserController', () => {
  let controller: UserController

  before(async () => {
    await createTestDatabaseConnection()
  })

  beforeEach(async () => {
    const connection = getConnection()
    await connection.dropDatabase()
    await connection.synchronize()
    controller = new UserController(new UserService())
  })

  it('should get all users when no users exist', async () => {
    const allUsers = await controller.getAll()

    assert.isNotNull(allUsers)
    assert.equal(allUsers.length, 0)
  })

  it('should get all users', async () => {
    const user = getTestUser('aaa', 'Test1')
    const user2 = getTestUser('bbb', 'Test2')
    const user3 = getTestUser('ccc', 'Test3')

    await getRepository(User).save(user)
    await getRepository(User).save(user2)
    await getRepository(User).save(user3)

    const allUsers = await controller.getAll()

    assert.isNotNull(allUsers)
    assert.equal(allUsers.length, 3)
  })

  it('should create a user', async () => {
    const user = getTestUser('asdf', 'Test')

    const apiUser = await controller.create({ body: user } as Request)
    assert.isNotNull(apiUser)
    assert.equal(apiUser.id, 'asdf')

    const allUsers = await getRepository(User).find()

    assert.isNotNull(allUsers)
    assert.equal(allUsers.length, 1)
  })

  it('should fail to create user if id is not provided', async () => {
    const user = getTestUser(undefined as any, 'Test')

    controller.create({ body: user } as Request).catch(err => {
      assert.exists(err)
    })
  })
})

function getTestUser (id: string, name: string) {
  const user = new User()
  user.id = id
  user.name = name
  user.dateCreated = new Date()
  user.verification = new UserVerification()
  user.settings = new UserSettings()
  user.reputation = new UserReputation()
  user.profile = new UserProfile()
  user.level = new UserLevel()
  user.balance = new UserBalance()

  return user
}
