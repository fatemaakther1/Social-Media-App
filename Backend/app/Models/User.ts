import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import UserPost from 'App/Models/UserPost'
import PostLike from 'App/Models/PostLike'
import PostComment from 'App/Models/PostComment'

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public username: string

  @column({ columnName: 'given_name' })
  public givenName: string | null

  @column()
  public surname: string | null

  @column({ serializeAs: null })
  public password: string

  @column({ columnName: 'remember_me_token' })
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships
  @hasMany(() => UserPost, {
    foreignKey: 'profileId',
  })
  public posts: HasMany<typeof UserPost>

  @hasMany(() => PostLike, {
    foreignKey: 'profileId',
  })
  public likes: HasMany<typeof PostLike>

  @hasMany(() => PostComment, {
    foreignKey: 'profileId',
  })
  public comments: HasMany<typeof PostComment>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
