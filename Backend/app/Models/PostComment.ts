import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import UserProfile from 'App/Models/User'
import UserPost from 'App/Models/UserPost'

export default class PostComment extends BaseModel {
  public static table = 'post_comments'

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'post_id' })
  public postId: number

  @column({ columnName: 'profile_id' })
  public profileId: number

  @column({ columnName: 'comment_text' })
  public commentText: string

  @column.dateTime({ columnName: 'created_datetime' })
  public createdDatetime: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships
  @belongsTo(() => UserPost, {
    foreignKey: 'postId',
  })
  public post: BelongsTo<typeof UserPost>

  @belongsTo(() => UserProfile, {
    foreignKey: 'profileId',
  })
  public profile: BelongsTo<typeof UserProfile>
}
