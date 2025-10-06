// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import UserPost from 'App/Models/UserPost'
// import { DateTime } from 'luxon'

// export default class PostsController {
//   // Get all posts with user info and engagement metrics
//   public async index({ response }: HttpContextContract) {
//     try {
//       const posts = await UserPost.query()
//         .preload('profile', (profileQuery) => {
//           profileQuery.select(['id', 'givenName', 'surname', 'emailAddress'])
//         })
//         .preload('likes')
//         .preload('comments', (commentQuery) => {
//           commentQuery.preload('profile', (profileQuery) => {
//             profileQuery.select(['id', 'givenName', 'surname'])
//           })
//         })
//         .orderBy('createdDatetime', 'desc')

//       return response.json(posts)
//     } catch (error) {
//       return response.status(500).json({ message: 'Failed to fetch posts', error: error.message })
//     }
//   }

//   // Get a specific post
//   public async show({ request, params, response }: HttpContextContract) {
//     try {
//       const post = await UserPost.query()
//         .where('id', params.id)
//         .preload('profile', (profileQuery) => {
//           profileQuery.select(['id', 'givenName', 'surname', 'emailAddress'])
//         })
//         .preload('likes', (likeQuery) => {
//           likeQuery.preload('profile', (profileQuery) => {
//             profileQuery.select(['id', 'givenName', 'surname'])
//           })
//         })
//         .preload('comments', (commentQuery) => {
//           commentQuery.preload('profile', (profileQuery) => {
//             profileQuery.select(['id', 'givenName', 'surname'])
//           }).orderBy('createdDatetime', 'asc')
//         })
//         .first()

//       if (!post) {
//         return response.status(404).json({ message: 'Post not found' })
//       }
      
//       return response.json(post)
//     } catch (error) {
//       return response.status(500).json({ message: 'Failed to fetch post', error: error.message })
//     }
//   }

//   // Create a new post
//   public async store({ request, response }: HttpContextContract) {
//     try {
//       const userId = request.encryptedCookie('user_id')
//       if (!userId) {
//         return response.status(401).json({ message: 'Authentication required' })
//       }
      
//       const writtenText = request.input('writtenText')
//       const mediaLocation = request.input('mediaLocation')

//       if (!writtenText && !mediaLocation) {
//         return response.status(400).json({ message: 'Post must contain either text or media' })
//       }

//       const post = new UserPost()
//       post.profileId = userId
//       post.writtenText = writtenText
//       post.mediaLocation = mediaLocation
//       post.createdDatetime = DateTime.now()
//       await post.save()

//       // Load the post with user info to return
//       await post.load('profile', (profileQuery) => {
//         profileQuery.select(['id', 'givenName', 'surname', 'emailAddress'])
//       })

//       return response.status(201).json(post)
//     } catch (error) {
//       return response.status(500).json({ message: 'Failed to create post', error: error.message })
//     }
//   }

//   // Update a post
//   public async update({ request, params, response }: HttpContextContract) {
//     try {
//       const userId = request.encryptedCookie('user_id')
//       if (!userId) {
//         return response.status(401).json({ message: 'Authentication required' })
//       }
      
//       const post = await UserPost.find(params.id)

//       if (!post) {
//         return response.status(404).json({ message: 'Post not found' })
//       }

//       // Check if user owns the post
//       if (post.profileId !== userId) {
//         return response.status(403).json({ message: 'You can only update your own posts' })
//       }

//       const writtenText = request.input('writtenText')
//       const mediaLocation = request.input('mediaLocation')

//       if (!writtenText && !mediaLocation) {
//         return response.status(400).json({ message: 'Post must contain either text or media' })
//       }

//       post.writtenText = writtenText
//       post.mediaLocation = mediaLocation
//       await post.save()

//       return response.json(post)
//     } catch (error) {
//       return response.status(500).json({ message: 'Failed to update post', error: error.message })
//     }
//   }

//   // Delete a post
//   public async destroy({ request, params, response }: HttpContextContract) {
//     try {
//       const userId = request.encryptedCookie('user_id')
//       if (!userId) {
//         return response.status(401).json({ message: 'Authentication required' })
//       }
      
//       const post = await UserPost.find(params.id)

//       if (!post) {
//         return response.status(404).json({ message: 'Post not found' })
//       }

//       // Check if user owns the post
//       if (post.profileId !== userId) {
//         return response.status(403).json({ message: 'You can only delete your own posts' })
//       }

//       await post.delete()
//       return response.json({ message: 'Post deleted successfully' })
//     } catch (error) {
//       return response.status(500).json({ message: 'Failed to delete post', error: error.message })
//     }
//   }

//   // Get posts by specific user
//   public async userPosts({ params, response }: HttpContextContract) {
//     try {
//       const posts = await UserPost.query()
//         .where('profileId', params.userId)
//         .preload('profile', (profileQuery) => {
//           profileQuery.select(['id', 'givenName', 'surname', 'emailAddress'])
//         })
//         .preload('likes')
//         .preload('comments')
//         .orderBy('createdDatetime', 'desc')

//       return response.json(posts)
//     } catch (error) {
//       return response.status(500).json({ message: 'Failed to fetch user posts', error: error.message })
//     }
//   }
// }
