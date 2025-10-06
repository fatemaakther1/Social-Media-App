// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import UserProfile from 'App/Models/User'
// import { DateTime } from 'luxon'

// export default class AuthController {
//   public async login({ request, auth, response }: HttpContextContract) {
//     // Debug logging
//     console.log('=== LOGIN DEBUG ===')
//     console.log('Request method:', request.method())
//     console.log('Request URL:', request.url())
//     console.log('Content-Type:', request.header('content-type'))
//     console.log('Raw body:', request.raw())
//     console.log('All inputs:', request.all())
    
//     // Try to get data from request.all() first, then try manual JSON parsing if needed
//     let data
//     const allInputs = request.all()
    
//     // Check if we got proper parsed data or raw character array
//     if (allInputs && typeof allInputs === 'object' && !Array.isArray(allInputs) && Object.keys(allInputs).some(key => isNaN(parseInt(key)))) {
//       // We have proper parsed data
//       data = allInputs
//     } else {
//       // Manual JSON parsing from raw body
//       try {
//         const rawBody = request.raw()
//         if (rawBody) {
//           data = JSON.parse(rawBody.toString())
//           console.log('Manually parsed JSON:', data)
//         } else {
//           data = {}
//         }
//       } catch (error) {
//         console.log('JSON parsing failed:', error.message)
//         data = {}
//       }
//     }
    
//     const emailAddress = data.emailAddress ?? data.email
//     const password = data.password

//     console.log('Parsed fields:')
//     console.log('- emailAddress:', emailAddress)
//     console.log('- password:', password ? '[HIDDEN]' : 'null/undefined')
//     console.log('===================')

//     if (!emailAddress || !password) {
//       console.log('VALIDATION FAILED: Missing emailAddress or password')
//       return response.status(400).json({ 
//         message: 'emailAddress and password are required',
//         debug: {
//           emailAddress: !!emailAddress,
//           password: !!password,
//           allInputs: request.all()
//         }
//       })
//     }

//     try {
//       const token = await auth.use('api').attempt(emailAddress, password, {
//         expiresIn: '10 days',
//       })
//       return token.toJSON()
//     } catch {
//       return response.status(400).json({ message: 'Invalid credentials' })
//     }
//   }

//   public async register({ request, auth, response }: HttpContextContract) {
//     // Debug logging
//     console.log('=== REGISTER DEBUG ===')
//     console.log('Request method:', request.method())
//     console.log('Request URL:', request.url())
//     console.log('Content-Type:', request.header('content-type'))
//     console.log('Raw body:', request.raw())
//     console.log('All inputs:', request.all())
//     console.log('Body exists:', !!request.body())
    
//     // Try to get data from request.all() first, then try manual JSON parsing if needed
//     let data
//     const allInputs = request.all()
    
//     // Check if we got proper parsed data or raw character array
//     if (allInputs && typeof allInputs === 'object' && !Array.isArray(allInputs) && Object.keys(allInputs).some(key => isNaN(parseInt(key)))) {
//       // We have proper parsed data
//       data = allInputs
//     } else {
//       // Manual JSON parsing from raw body
//       try {
//         const rawBody = request.raw()
//         if (rawBody) {
//           data = JSON.parse(rawBody.toString())
//           console.log('Manually parsed JSON:', data)
//         } else {
//           data = {}
//         }
//       } catch (error) {
//         console.log('JSON parsing failed:', error.message)
//         data = {}
//       }
//     }
    
//     const emailAddress = data.emailAddress ?? data.email
//     const password = data.password
//     const givenName = data.givenName
//     const surname = data.surname
//     const country = data.country
//     const dateOfBirth = data.dateOfBirth // ISO string e.g., 2001-01-18

//     console.log('Parsed fields:')
//     console.log('- emailAddress:', emailAddress)
//     console.log('- password:', password ? '[HIDDEN]' : 'null/undefined')
//     console.log('- givenName:', givenName)
//     console.log('- surname:', surname)
//     console.log('- country:', country)
//     console.log('- dateOfBirth:', dateOfBirth)
//     console.log('========================')

//     if (!emailAddress || !password) {
//       console.log('VALIDATION FAILED: Missing emailAddress or password')
//       return response.status(400).json({ 
//         message: 'emailAddress and password are required',
//         debug: {
//           emailAddress: !!emailAddress,
//           password: !!password,
//           allInputs: request.all()
//         }
//       })
//     }

//     try {
//       // Check if user already exists
//       const existingUser = await UserProfile.findBy('emailAddress', emailAddress)
//       if (existingUser) {
//         return response.status(400).json({ message: 'Email already registered' })
//       }

//       // Create a new user
//       const user = new UserProfile()
//       user.emailAddress = emailAddress
//       user.password = password
//       user.givenName = givenName
//       user.surname = surname
//       user.country = country
//       user.dateOfBirth = dateOfBirth ? DateTime.fromISO(dateOfBirth) : null
//       await user.save()

//       const token = await auth.use('api').login(user, {
//         expiresIn: '10 days',
//       })

//       return token.toJSON()
//     } catch (error) {
//       return response.status(500).json({ message: 'Registration failed', error: error.message })
//     }
//   }

//   public async logout({ auth, response }: HttpContextContract) {
//     try {
//       await auth.use('api').revoke()
//       return response.json({ message: 'Logged out successfully' })
//     } catch (error) {
//       return response.status(500).json({ message: 'Logout failed' })
//     }
//   }

//   public async profile({ auth }: HttpContextContract) {
//     const user = await auth.authenticate()
//     return user
//   }
// }
