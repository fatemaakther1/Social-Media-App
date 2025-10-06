import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AuthService from "./authService";
import AuthValidator from "./authValidator";

export default class AuthController {
  private service: AuthService;
  private validator: AuthValidator;

  constructor() {
    this.service = new AuthService();
    this.validator = new AuthValidator();
  }

  // Register new user
  public async register(ctx: HttpContextContract) {
    try {
      console.log('🔍 Register Request Body:', ctx.request.body());
      console.log('🔍 Register Request Headers:', ctx.request.headers());
      
      const validatedData = await this.validator.registerValidator(ctx);
      console.log('✅ Validation successful:', validatedData);
      
      const user = await this.service.registerUser(validatedData);
      console.log('✅ User created successfully:', { id: user.id, email: user.email });
    
    // Create authentication cookie
    console.log('🍪 Setting cookies for user:', user.id);
    console.log('🔍 Request origin:', ctx.request.header('origin'));
    console.log('🔍 Request host:', ctx.request.header('host'));
    
    // Cookie options for development (no sameSite restriction)
    const cookieOptions = {
      httpOnly: false, // Allow JS access for debugging
      secure: false, // HTTP in development
      path: '/', // Available on all paths
      maxAge: 60 * 60 * 2, // 2 hours in seconds
      domain: undefined // Let browser decide
    }
    
    ctx.response.encryptedCookie('user_id', user.id, cookieOptions);
    ctx.response.encryptedCookie('user_email', user.email, cookieOptions);
    
    // Also log what cookies were set
    console.log('🍪 Cookies set with options:', cookieOptions);
    console.log('✅ Cookies set successfully');
    
      return ctx.response.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('❌ Registration Error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        stack: error.stack
      });
      
      return ctx.response.status(error.status || 500).json({
        success: false,
        message: error.message || 'Registration failed',
        error: error.code || 'INTERNAL_ERROR'
      });
    }
  }

  // Login user
  public async login(ctx: HttpContextContract) {
    try {
      console.log('🔍 Login Request Body:', ctx.request.body());
      console.log('🔍 Login Request Headers:', ctx.request.headers());
      
      const validatedData = await this.validator.loginValidator(ctx);
      console.log('✅ Login validation successful:', { email: validatedData.email });
      
      const user = await this.service.loginUser(validatedData);
      console.log('✅ User login successful:', { id: user.id, email: user.email });
    
    // Create authentication cookies
    console.log('🍪 Setting cookies for user:', user.id);
    console.log('🔍 Request origin:', ctx.request.header('origin'));
    console.log('🔍 Request host:', ctx.request.header('host'));
    
    // Cookie options for development (no sameSite restriction)
    const cookieOptions = {
      httpOnly: false, // Allow JS access for debugging
      secure: false, // HTTP in development
      path: '/', // Available on all paths
      maxAge: 60 * 60 * 2, // 2 hours in seconds
      domain: undefined // Let browser decide
    }
    
    ctx.response.encryptedCookie('user_id', user.id, cookieOptions);
    ctx.response.encryptedCookie('user_email', user.email, cookieOptions);
    
    // Also log what cookies were set
    console.log('🍪 Cookies set with options:', cookieOptions);
    console.log('✅ Cookies set successfully');
    
      return ctx.response.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      console.error('❌ Login Error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        stack: error.stack
      });
      
      return ctx.response.status(error.status || 500).json({
        success: false,
        message: error.message || 'Login failed',
        error: error.code || 'INTERNAL_ERROR'
      });
    }
  }

  // Logout user
  public async logout(ctx: HttpContextContract) {
    // Clear authentication cookies
    ctx.response.clearCookie('user_id');
    ctx.response.clearCookie('user_email');
    
    return ctx.response.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  // Get current user profile
  public async profile(ctx: HttpContextContract) {
    const userId = ctx.request.encryptedCookie('user_id');
    
    if (!userId) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await this.service.getUserProfile(userId);
    
    return ctx.response.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  }

  // Update user profile
  public async updateProfile(ctx: HttpContextContract) {
    const userId = ctx.request.encryptedCookie('user_id');
    
    if (!userId) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const validatedData = await this.validator.updateProfileValidator(ctx);
    const user = await this.service.updateUserProfile(userId, validatedData);
    
    return ctx.response.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        updatedAt: user.updatedAt
      }
    });
  }

  // Change password
  public async changePassword(ctx: HttpContextContract) {
    const userId = ctx.request.encryptedCookie('user_id');
    
    if (!userId) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const validatedData = await this.validator.changePasswordValidator(ctx);
    await this.service.changePassword(userId, validatedData);
    
    return ctx.response.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  }

  // Check session status
  public async checkSession(ctx: HttpContextContract) {
    const userId = ctx.request.encryptedCookie('user_id');
    const userEmail = ctx.request.encryptedCookie('user_email');
    
    if (!userId) {
      return ctx.response.status(401).json({
        success: false,
        message: 'No active session',
        authenticated: false
      });
    }

    return ctx.response.status(200).json({
      success: true,
      message: 'Session active',
      authenticated: true,
      user: {
        id: userId,
        email: userEmail
      }
    });
  }
}