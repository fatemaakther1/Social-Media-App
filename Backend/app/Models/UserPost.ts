import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import UserProfile from 'App/Models/User'
import PostLike from 'App/Models/PostLike'
import PostComment from 'App/Models/PostComment'

export default class UserPost extends BaseModel {
  public static table = 'user_posts'

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'profile_id' })
  public profileId: number

  @column({ columnName: 'written_text' })
  public writtenText: string | null

  @column({ columnName: 'media_location' })
  public mediaLocation: string | null

  @column.dateTime({ columnName: 'created_datetime' })
  public createdDatetime: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships
  @belongsTo(() => UserProfile, {
    foreignKey: 'profileId',
  })
  public profile: BelongsTo<typeof UserProfile>

  @hasMany(() => PostLike, {
    foreignKey: 'postId',
  })
  public likes: HasMany<typeof PostLike>

  @hasMany(() => PostComment, {
    foreignKey: 'postId',
  })
  public comments: HasMany<typeof PostComment>
}
