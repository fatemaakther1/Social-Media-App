/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Import auth routes
import '../app/Controllers/Http/Auth/authRoutes'

// Default route
Route.get('/', async () => {
  return { 
    message: 'BUDDY-SCRIPT Backend API with Session Auth',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      posts: '/api/posts',
      likes: '/api/likes',
      comments: '/api/comments'
    }
  }
})

// API routes with prefix
Route.group(() => {
  // Authentication routes (public)
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')

  // Protected routes (require authentication)
  Route.group(() => {
    // Auth routes
    Route.post('logout', 'AuthController.logout')
    Route.get('profile', 'AuthController.profile')

    // Posts routes
    Route.get('posts', 'PostController.index') // Get all posts
    Route.post('posts', 'PostController.store') // Create new post
    Route.get('posts/:id', 'PostController.show') // Get specific post
    Route.put('posts/:id', 'PostController.update') // Update post
    Route.delete('posts/:id', 'PostController.destroy') // Delete post
    Route.get('users/:userId/posts', 'PostController.userPosts') // Get posts by user

    // Likes routes
    Route.post('posts/:postId/like', 'LikesController.toggle') // Toggle like on post
    Route.get('posts/:postId/likes', 'LikesController.getPostLikes') // Get all likes for post
    Route.get('posts/:postId/like-status', 'LikesController.checkUserLike') // Check if user liked post
    Route.get('my-likes', 'LikesController.getUserLikes') // Get current user's likes

    // Comments routes
    Route.get('posts/:postId/comments', 'CommentsController.index') // Get all comments for post
    Route.post('posts/:postId/comments', 'CommentsController.store') // Create comment on post
    Route.get('comments/:id', 'CommentsController.show') // Get specific comment
    Route.put('comments/:id', 'CommentsController.update') // Update comment
    Route.delete('comments/:id', 'CommentsController.destroy') // Delete comment
    Route.get('my-comments', 'CommentsController.userComments') // Get current user's comments

  }).middleware('authSession')

}).prefix('api')
