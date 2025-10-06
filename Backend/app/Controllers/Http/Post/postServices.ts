import UserPost from 'App/Models/UserPost'
import { DateTime } from 'luxon'

export class PostService {
  // Helper method to create a post
  public static async createPost(userId: number, writtenText?: string, mediaLocation?: string) {
    const post = new UserPost()
    post.profileId = userId
    post.writtenText = writtenText || null
    post.mediaLocation = mediaLocation || null
    post.createdDatetime = DateTime.now()
    await post.save()

    // Load the post with user info
    await post.load('profile', (profileQuery) => {
      profileQuery.select(['id', 'givenName', 'surname', 'email'])
    })

    return post
  }

  // Helper method to get posts with all relations
  public static async getPostsWithRelations() {
    return await UserPost.query()
      .preload('profile', (profileQuery) => {
        profileQuery.select(['id', 'givenName', 'surname', 'email'])
      })
      .preload('likes')
      .preload('comments', (commentQuery) => {
        commentQuery.preload('profile', (profileQuery) => {
          profileQuery.select(['id', 'givenName', 'surname'])
        })
      })
      .orderBy('createdDatetime', 'desc')
  }
}