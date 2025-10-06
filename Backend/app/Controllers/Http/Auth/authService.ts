import Hash from "@ioc:Adonis/Core/Hash";
import { Exception } from "@adonisjs/core/build/standalone";
import AuthQuery from "./authQuery";

export default class AuthService {
  private authQuery: AuthQuery;

  constructor() {
    this.authQuery = new AuthQuery();
  }

  // Register new user
  public async registerUser(data: {
    email: string;
    password: string;
    username?: string;
  }) {
    // Check if user already exists
    const existingUser = await this.authQuery.findByEmail(data.email);
    if (existingUser) {
      throw new Exception(
        "User with this email already exists",
        400,
        "E_USER_EXISTS"
      );
    }

    // Check if username is taken (if provided)
    if (data.username) {
      const existingUsername = await this.authQuery.findByUsername(data.username);
      if (existingUsername) {
        throw new Exception(
          "Username is already taken",
          400,
          "E_USERNAME_EXISTS"
        );
      }
    }

    // Create user data (password will be hashed by the User model's @beforeSave hook)
    const userData = {
      email: data.email,
      password: data.password, // Let the model hash this
      username: data.username || data.email.split('@')[0], // Default username from email
    };

    // Create user
    const user = await this.authQuery.createUser(userData);
    
    if (!user) {
      throw new Exception(
        "Failed to create user",
        500,
        "E_USER_CREATE_FAILED"
      );
    }

    return user;
  }

  // Login user
  public async loginUser(data: {
    email: string;
    password: string;
  }) {
    // Find user by email
    const user = await this.authQuery.findByEmail(data.email);
    if (!user) {
      throw new Exception(
        "Invalid credentials",
        401,
        "E_INVALID_CREDENTIALS"
      );
    }

    // Verify password
    const isValidPassword = await Hash.verify(user.password, data.password);
    if (!isValidPassword) {
      throw new Exception(
        "Invalid credentials",
        401,
        "E_INVALID_CREDENTIALS"
      );
    }

    // Update last login (optional)
    await this.authQuery.updateLastLogin(user.id);

    return user;
  }

  // Get user profile by ID
  public async getUserProfile(userId: number) {
    const user = await this.authQuery.findById(userId);
    if (!user) {
      throw new Exception(
        "User not found",
        404,
        "E_USER_NOT_FOUND"
      );
    }

    return user;
  }

  // Update user profile
  public async updateUserProfile(userId: number, data: {
    username?: string;
    email?: string;
  }) {
    // Check if user exists
    const existingUser = await this.authQuery.findById(userId);
    if (!existingUser) {
      throw new Exception(
        "User not found",
        404,
        "E_USER_NOT_FOUND"
      );
    }

    // Check if email is being changed and is not taken
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.authQuery.findByEmail(data.email);
      if (emailExists) {
        throw new Exception(
          "Email is already taken",
          400,
          "E_EMAIL_EXISTS"
        );
      }
    }

    // Check if username is being changed and is not taken
    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await this.authQuery.findByUsername(data.username);
      if (usernameExists) {
        throw new Exception(
          "Username is already taken",
          400,
          "E_USERNAME_EXISTS"
        );
      }
    }

    // Update user
    const updatedUser = await this.authQuery.updateUser(userId, data);
    if (!updatedUser) {
      throw new Exception(
        "Failed to update user profile",
        500,
        "E_UPDATE_FAILED"
      );
    }

    return updatedUser;
  }

  // Change password
  public async changePassword(userId: number, data: {
    currentPassword: string;
    newPassword: string;
  }) {
    // Get user
    const user = await this.authQuery.findById(userId);
    if (!user) {
      throw new Exception(
        "User not found",
        404,
        "E_USER_NOT_FOUND"
      );
    }

    // Verify current password
    const isValidPassword = await Hash.verify(user.password, data.currentPassword);
    if (!isValidPassword) {
      throw new Exception(
        "Current password is incorrect",
        400,
        "E_INVALID_CURRENT_PASSWORD"
      );
    }

    // Update password (will be hashed by the User model's @beforeSave hook)
    const updated = await this.authQuery.updateUser(userId, {
      password: data.newPassword,
    });

    if (!updated) {
      throw new Exception(
        "Failed to update password",
        500,
        "E_PASSWORD_UPDATE_FAILED"
      );
    }

    return true;
  }

  // Delete user account
  public async deleteUser(userId: number) {
    const user = await this.authQuery.findById(userId);
    if (!user) {
      throw new Exception(
        "User not found",
        404,
        "E_USER_NOT_FOUND"
      );
    }

    const deleted = await this.authQuery.deleteUser(userId);
    if (!deleted) {
      throw new Exception(
        "Failed to delete user",
        500,
        "E_DELETE_FAILED"
      );
    }

    return true;
  }

  // Get all users (admin function)
  public async getAllUsers() {
    return await this.authQuery.getAllUsers();
  }
}