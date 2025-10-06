import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Custom CORS middleware for handling cross-origin requests
 * Specifically configured for session-based authentication
 */
export default class Cors {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // Get the origin from the request
    const origin = request.header('origin')
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001']
    
    console.log('🌍 CORS Request:', {
      method: request.method(),
      url: request.url(),
      origin: origin,
      allowed: allowedOrigins.includes(origin)
    });
    
    // Set CORS headers
    if (allowedOrigins.includes(origin)) {
      response.header('Access-Control-Allow-Origin', origin)
      console.log('✅ CORS Origin allowed:', origin);
    } else {
      console.log('❌ CORS Origin rejected:', origin);
    }
    response.header('Access-Control-Allow-Credentials', 'true')
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    response.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    response.header('Access-Control-Max-Age', '86400')

    // Handle preflight requests
    if (request.method() === 'OPTIONS') {
      return response.status(200).send('')
    }

    await next()
  }
}