import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostLike from 'App/Models/PostLike'
import UserPost from 'App/Models/UserPost'
import { DateTime } from 'luxon'

export default class LikesController {
  // Toggle like on a post (like if not liked, unlike if already liked)
  public async toggle({ request, params, response }: HttpContextContract) {
    try {
      const userId = request.encryptedCookie('user_id')
      if (!userId) {
        return response.status(401).json({ message: 'Authentication required' })
      }
     
      const postId = params.postId

      // Check if post exists
      const post = await UserPost.find(postId)
      if (!post) {
        return response.status(404).json({ message: 'Post not found' })
      }

      // Check if user already liked this post
      const existingLike = await PostLike.query()
        .where('postId', postId)
        .where('profileId', userId)
        .first()

      if (existingLike) {
        // Unlike - remove the like
        await existingLike.delete()
        return response.json({ message: 'Post unliked', liked: false })
      } else {
        // Like - create new like
        const like = new PostLike()
        like.postId = postId
        like.profileId = userId
        like.createdTime = DateTime.now()
        await like.save()

        // Load user info for response
        await like.load('profile', (profileQuery) => {
          profileQuery.select(['id', 'givenName', 'surname'])
        })

        return response.status(201).json({ message: 'Post liked', liked: true, like })
      }
    } catch (error) {
      return response.status(500).json({ message: 'Failed to toggle like', error: error.message })
    }
  }

  // Get all likes for a specific post
  public async getPostLikes({ params, response }: HttpContextContract) {
    try {
      const likes = await PostLike.query()
        .where('postId', params.postId)
        .preload('profile', (profileQuery) => {
          profileQuery.select(['id', 'givenName', 'surname', 'email'])
        })
        .orderBy('createdTime', 'desc')

      return response.json({
        count: likes.length,
        likes: likes
      })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to fetch likes', error: error.message })
    }
  }

  // Check if current user liked a specific post
  public async checkUserLike({ request, params, response }: HttpContextContract) {
    try {
      const userId = request.encryptedCookie('user_id')
      if (!userId) {
        return response.status(401).json({ message: 'Authentication required' })
      }
     
      const like = await PostLike.query()
        .where('postId', params.postId)
        .where('profileId', userId)
        .first()

      return response.json({ liked: !!like })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to check like status', error: error.message })
    }
  }

  // Get all posts liked by a user
  public async getUserLikes({ request, response }: HttpContextContract) {
    try {
      const userId = request.encryptedCookie('user_id')
      if (!userId) {
        return response.status(401).json({ message: 'Authentication required' })
      }
     
      const likes = await PostLike.query()
        .where('profileId', userId)
        .preload('post', (postQuery) => {
          postQuery.preload('profile', (profileQuery) => {
            profileQuery.select(['id', 'givenName', 'surname'])
          })
        })
        .orderBy('createdTime', 'desc')

      return response.json(likes)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to fetch user likes', error: error.message })
    }
  }
}