import User from "App/Models/User";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AuthQuery {
  
  // Create a new user
  public async createUser(userData: {
    email: string;
    password: string;
    username: string;
  }) {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  // Find user by email
  public async findByEmail(email: string) {
    try {
      const user = await User.findBy('email', email);
      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  }

  // Find user by username
  public async findByUsername(username: string) {
    try {
      const user = await User.findBy('username', username);
      return user;
    } catch (error) {
      console.error("Error finding user by username:", error);
      return null;
    }
  }

  // Find user by ID
  public async findById(id: number) {
    try {
      const user = await User.find(id);
      return user;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return null;
    }
  }

  // Update user information
  public async updateUser(id: number, updateData: {
    email?: string;
    username?: string;
    password?: string;
  }) {
    try {
      const user = await User.find(id);
      if (!user) {
        return null;
      }

      // Update only provided fields
      if (updateData.email) user.email = updateData.email;
      if (updateData.username) user.username = updateData.username;
      if (updateData.password) user.password = updateData.password;

      await user.save();
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  // Update last login timestamp
  public async updateLastLogin(id: number) {
    try {
      const user = await User.find(id);
      if (!user) {
        return null;
      }

      // If your User model has a lastLoginAt field
      // user.lastLoginAt = new Date();
      await user.save();
      return user;
    } catch (error) {
      console.error("Error updating last login:", error);
      return null;
    }
  }

  // Delete user
  public async deleteUser(id: number) {
    try {
      const user = await User.find(id);
      if (!user) {
        return false;
      }

      await user.delete();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Get all users (for admin purposes)
  public async getAllUsers() {
    try {
      const users = await User.query()
        .select('id', 'email', 'username', 'created_at', 'updated_at')
        .orderBy('created_at', 'desc');
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }

  // Get users with pagination
  public async getUsersPaginated(page: number = 1, limit: number = 10) {
    try {
      const users = await User.query()
        .select('id', 'email', 'username', 'created_at', 'updated_at')
        .orderBy('created_at', 'desc')
        .paginate(page, limit);
      return users;
    } catch (error) {
      console.error("Error fetching paginated users:", error);
      return null;
    }
  }

  // Search users by email or username
  public async searchUsers(searchTerm: string) {
    try {
      const users = await User.query()
        .select('id', 'email', 'username', 'created_at')
        .where('email', 'like', `%${searchTerm}%`)
        .orWhere('username', 'like', `%${searchTerm}%`)
        .orderBy('created_at', 'desc')
        .limit(50);
      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  // Count total users
  public async getUserCount() {
    try {
      const count = await User.query().count('* as total');
      return count[0].$extras.total;
    } catch (error) {
      console.error("Error counting users:", error);
      return 0;
    }
  }

  // Check if email exists (for registration validation)
  public async emailExists(email: string, excludeId?: number) {
    try {
      const query = User.query().where('email', email);
      
      if (excludeId) {
        query.where('id', '!=', excludeId);
      }
      
      const user = await query.first();
      return !!user;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  }

  // Check if username exists (for registration validation)
  public async usernameExists(username: string, excludeId?: number) {
    try {
      const query = User.query().where('username', username);
      
      if (excludeId) {
        query.where('id', '!=', excludeId);
      }
      
      const user = await query.first();
      return !!user;
    } catch (error) {
      console.error("Error checking username existence:", error);
      return false;
    }
  }

  // Get user with their posts (if you have a relationship)
  public async getUserWithPosts(id: number) {
    try {
      const user = await User.query()
        .where('id', id)
        .preload('posts') // Assuming you have a posts relationship
        .first();
      return user;
    } catch (error) {
      console.error("Error fetching user with posts:", error);
      return null;
    }
  }

  // Raw query example for complex operations
  public async getUserStats(id: number) {
    try {
      const stats = await Database.from('users')
        .leftJoin('user_posts', 'users.id', 'user_posts.user_id')
        .leftJoin('post_likes', 'user_posts.id', 'post_likes.post_id')
        .where('users.id', id)
        .groupBy('users.id')
        .select([
          'users.id',
          'users.email',
          'users.username',
          Database.raw('COUNT(DISTINCT user_posts.id) as post_count'),
          Database.raw('COUNT(DISTINCT post_likes.id) as total_likes')
        ])
        .first();
      
      return stats;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  }
}