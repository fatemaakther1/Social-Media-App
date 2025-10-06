import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostComment from 'App/Models/PostComment'
import UserPost from 'App/Models/UserPost'
import { DateTime } from 'luxon'

export default class CommentController {
  // Get all comments for a specific post
  public async index({ params, response }: HttpContextContract) {
    try {
      const comments = await PostComment.query()
        .where('postId', params.postId)
        .preload('profile', (profileQuery) => {
          profileQuery.select(['id', 'givenName', 'surname', 'email'])
        })
        .orderBy('createdDatetime', 'asc')

      return response.json({
        count: comments.length,
        comments: comments
      })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to fetch comments', error: error.message })
    }
  }

  // Get a specific comment
  public async show({ params, response }: HttpContextContract) {
    try {
      const comment = await PostComment.query()
        .where('id', params.id)
        .preload('profile', (profileQuery) => {
          profileQuery.select(['id', 'givenName', 'surname', 'email'])
        })
        .preload('post')
        .first()

      if (!comment) {
        return response.status(404).json({ message: 'Comment not found' })
      }

      return response.json(comment)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to fetch comment', error: error.message })
    }
  }

  // Create a new comment on a post
  public async store({ request, params, response }: HttpContextContract) {
    try {
      const userId = request.encryptedCookie('user_id')
      if (!userId) {
        return response.status(401).json({ message: 'Authentication required' })
      }

      const postId = params.postId
      const commentText = request.input('commentText')

      if (!commentText || !commentText.trim()) {
        return response.status(400).json({ message: 'Comment text is required' })
      }

      // Check if post exists
      const post = await UserPost.find(postId)
      if (!post) {
        return response.status(404).json({ message: 'Post not found' })
      }

      const comment = new PostComment()
      comment.postId = postId
      comment.profileId = userId
      comment.commentText = commentText.trim()
      comment.createdDatetime = DateTime.now()
      await comment.save()

      // Load the comment with user info to return
      await comment.load('profile', (profileQuery) => {
        profileQuery.select(['id', 'givenName', 'surname', 'email'])
      })

      return response.status(201).json(comment)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create comment', error: error.message })
    }
  }

  // Update a comment
  public async update({ request, params, response }: HttpContextContract) {
    try {
      const userId = request.encryptedCookie('user_id')
      if (!userId) {
        return response.status(401).json({ message: 'Authentication required' })
      }

      const commentText = request.input('commentText')
      
      if (!commentText || !commentText.trim()) {
        return response.status(400).json({ message: 'Comment text is required' })
      }

      const comment = await PostComment.find(params.id)
      if (!comment) {
        return response.status(404).json({ message: 'Comment not found' })
      }

      // Check if user owns the comment
      if (comment.profileId !== userId) {
        return response.status(403).json({ message: 'You can only update your own comments' })
      }

      comment.commentText = commentText.trim()
      await comment.save()

      // Load the comment with user info to return
      await comment.load('profile', (profileQuery) => {
        profileQuery.select(['id', 'givenName', 'surname', 'email'])
      })

      return response.json(comment)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update comment', error: error.message })
    }
  }

  // Delete a comment
  public async destroy({ request, params, response }: HttpContextContract) {
    try {
      const userId = request.encryptedCookie('user_id')
      if (!userId) {
        return response.status(401).json({ message: 'Authentication required' })
      }

      const comment = await PostComment.find(params.id)
      if (!comment) {
        return response.status(404).json({ message: 'Comment not found' })
      }

      // Check if user owns the comment
      if (comment.profileId !== userId) {
        return response.status(403).json({ message: 'You can only delete your own comments' })
      }

      await comment.delete()
      return response.json({ message: 'Comment deleted successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to delete comment', error: error.message })
    }
  }

  // Get all comments by current user
  public async userComments({ request, response }: HttpContextContract) {
    try {
      const userId = request.encryptedCookie('user_id')
      if (!userId) {
        return response.status(401).json({ message: 'Authentication required' })
      }

      const comments = await PostComment.query()
        .where('profileId', userId)
        .preload('profile', (profileQuery) => {
          profileQuery.select(['id', 'givenName', 'surname', 'email'])
        })
        .preload('post', (postQuery) => {
          postQuery.preload('profile', (profileQuery) => {
            profileQuery.select(['id', 'givenName', 'surname'])
          })
        })
        .orderBy('createdDatetime', 'desc')

      return response.json(comments)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to fetch user comments', error: error.message })
    }
  }
}