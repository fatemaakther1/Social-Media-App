import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Cookie-based authentication middleware
 * Checks if a user is authenticated via encrypted cookies
 */
export default class AuthSession {
  /**
   * Handle request
   */
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // Debug: Log all cookies for troubleshooting
    const rawCookieHeader = ctx.request.header('cookie')
    console.log('🔍 AuthSession Debug - Raw Cookie Header:', rawCookieHeader)
    console.log('🔍 AuthSession Debug - All cookies:', ctx.request.cookies)
    console.log('🔍 AuthSession Debug - Request details:', {
      method: ctx.request.method(),
      url: ctx.request.url(),
      origin: ctx.request.header('origin'),
      host: ctx.request.header('host'),
      userAgent: ctx.request.header('user-agent'),
      referrer: ctx.request.header('referer')
    })
    
    // Check if user cookie exists
    const userId = ctx.request.encryptedCookie('user_id')
    console.log('🔍 AuthSession Debug - Decrypted userId:', userId)
    
    if (!userId) {
      console.log('❌ AuthSession Debug - No userId found, rejecting request')
      return ctx.response.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'Please login to access this resource'
      })
    }
    
    console.log('✅ AuthSession Debug - User authenticated, userId:', userId)

    // Optionally, you can verify the user still exists in the database
    // This is useful if you want to invalidate cookies for deleted users
    /*
    const User = (await import('App/Models/User')).default
    const user = await User.find(userId)
    
    if (!user) {
      ctx.response.clearCookie('user_id')
      ctx.response.clearCookie('user_email')
      return ctx.response.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'User authentication is invalid'
      })
    }
    
    // You can attach the user to the context for use in controllers
    ctx.user = user
    */

    await next()
  }
}