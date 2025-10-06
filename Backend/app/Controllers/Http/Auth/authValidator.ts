import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { Exception } from "@adonisjs/core/build/standalone";

export default class AuthValidator {

  // Validate registration data
  public async registerValidator(ctx: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.maxLength(255),
        rules.normalizeEmail({
          allLowercase: true,
          gmailRemoveDots: false,
        }),
      ]),
      password: schema.string({}, [
        rules.minLength(6),
        rules.maxLength(128),
        rules.confirmed('password_confirmation'),
      ]),
      password_confirmation: schema.string(),
      username: schema.string.optional({}, [
        rules.minLength(3),
        rules.maxLength(50),
        rules.alphaNum({
          allow: ['underscore', 'dash']
        }),
      ]),
    });

    const messages = {
      'email.required': 'Email is required',
      'email.email': 'Please provide a valid email address',
      'email.maxLength': 'Email cannot be longer than 255 characters',
      'password.required': 'Password is required',
      'password.minLength': 'Password must be at least 6 characters long',
      'password.maxLength': 'Password cannot be longer than 128 characters',
      'password.confirmed': 'Password confirmation does not match',
      'password_confirmation.required': 'Password confirmation is required',
      'username.minLength': 'Username must be at least 3 characters long',
      'username.maxLength': 'Username cannot be longer than 50 characters',
      'username.alphaNum': 'Username can only contain letters, numbers, underscores, and dashes',
    };

    try {
      const validatedData = await ctx.request.validate({
        schema: validationSchema,
        messages: messages,
      });
      return validatedData;
    } catch (error) {
      throw new Exception(
        error.messages ? JSON.stringify(error.messages) : "Validation failed",
        422,
        "E_VALIDATION_FAILED"
      );
    }
  }

  // Validate login data
  public async loginValidator(ctx: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.maxLength(255),
        rules.normalizeEmail({
          allLowercase: true,
          gmailRemoveDots: false,
        }),
      ]),
      password: schema.string({}, [
        rules.minLength(1),
        rules.maxLength(128),
      ]),
    });

    const messages = {
      'email.required': 'Email is required',
      'email.email': 'Please provide a valid email address',
      'email.maxLength': 'Email cannot be longer than 255 characters',
      'password.required': 'Password is required',
      'password.minLength': 'Password is required',
      'password.maxLength': 'Password cannot be longer than 128 characters',
    };

    try {
      const validatedData = await ctx.request.validate({
        schema: validationSchema,
        messages: messages,
      });
      return validatedData;
    } catch (error) {
      throw new Exception(
        error.messages ? JSON.stringify(error.messages) : "Validation failed",
        422,
        "E_VALIDATION_FAILED"
      );
    }
  }

  // Validate profile update data
  public async updateProfileValidator(ctx: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string.optional({}, [
        rules.email(),
        rules.maxLength(255),
        rules.normalizeEmail({
          allLowercase: true,
          gmailRemoveDots: false,
        }),
      ]),
      username: schema.string.optional({}, [
        rules.minLength(3),
        rules.maxLength(50),
        rules.alphaNum({
          allow: ['underscore', 'dash']
        }),
      ]),
    });

    const messages = {
      'email.email': 'Please provide a valid email address',
      'email.maxLength': 'Email cannot be longer than 255 characters',
      'username.minLength': 'Username must be at least 3 characters long',
      'username.maxLength': 'Username cannot be longer than 50 characters',
      'username.alphaNum': 'Username can only contain letters, numbers, underscores, and dashes',
    };

    try {
      const validatedData = await ctx.request.validate({
        schema: validationSchema,
        messages: messages,
      });

      // Check if at least one field is provided
      if (!validatedData.email && !validatedData.username) {
        throw new Exception(
          "At least one field (email or username) must be provided for update",
          422,
          "E_VALIDATION_FAILED"
        );
      }

      return validatedData;
    } catch (error) {
      if (error.code === "E_VALIDATION_FAILED") {
        throw error;
      }
      throw new Exception(
        error.messages ? JSON.stringify(error.messages) : "Validation failed",
        422,
        "E_VALIDATION_FAILED"
      );
    }
  }

  // Validate change password data
  public async changePasswordValidator(ctx: HttpContextContract) {
    const validationSchema = schema.create({
      currentPassword: schema.string({}, [
        rules.minLength(1),
        rules.maxLength(128),
      ]),
      newPassword: schema.string({}, [
        rules.minLength(6),
        rules.maxLength(128),
        rules.confirmed('confirmPassword'),
      ]),
      confirmPassword: schema.string(),
    });

    const messages = {
      'currentPassword.required': 'Current password is required',
      'currentPassword.minLength': 'Current password is required',
      'currentPassword.maxLength': 'Current password cannot be longer than 128 characters',
      'newPassword.required': 'New password is required',
      'newPassword.minLength': 'New password must be at least 6 characters long',
      'newPassword.maxLength': 'New password cannot be longer than 128 characters',
      'newPassword.confirmed': 'New password confirmation does not match',
      'confirmPassword.required': 'Password confirmation is required',
    };

    try {
      const validatedData = await ctx.request.validate({
        schema: validationSchema,
        messages: messages,
      });

      // Check if new password is different from current password
      if (validatedData.currentPassword === validatedData.newPassword) {
        throw new Exception(
          "New password must be different from current password",
          422,
          "E_VALIDATION_FAILED"
        );
      }

      return {
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword,
      };
    } catch (error) {
      if (error.code === "E_VALIDATION_FAILED") {
        throw error;
      }
      throw new Exception(
        error.messages ? JSON.stringify(error.messages) : "Validation failed",
        422,
        "E_VALIDATION_FAILED"
      );
    }
  }

  // Validate forgot password email
  public async forgotPasswordValidator(ctx: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.maxLength(255),
        rules.normalizeEmail({
          allLowercase: true,
          gmailRemoveDots: false,
        }),
      ]),
    });

    const messages = {
      'email.required': 'Email is required',
      'email.email': 'Please provide a valid email address',
      'email.maxLength': 'Email cannot be longer than 255 characters',
    };

    try {
      const validatedData = await ctx.request.validate({
        schema: validationSchema,
        messages: messages,
      });
      return validatedData;
    } catch (error) {
      throw new Exception(
        error.messages ? JSON.stringify(error.messages) : "Validation failed",
        422,
        "E_VALIDATION_FAILED"
      );
    }
  }

  // Validate reset password data
  public async resetPasswordValidator(ctx: HttpContextContract) {
    const validationSchema = schema.create({
      token: schema.string({}, [
        rules.minLength(1),
        rules.maxLength(255),
      ]),
      password: schema.string({}, [
        rules.minLength(6),
        rules.maxLength(128),
        rules.confirmed('confirmPassword'),
      ]),
      confirmPassword: schema.string(),
    });

    const messages = {
      'token.required': 'Reset token is required',
      'token.minLength': 'Reset token is required',
      'token.maxLength': 'Invalid reset token',
      'password.required': 'New password is required',
      'password.minLength': 'Password must be at least 6 characters long',
      'password.maxLength': 'Password cannot be longer than 128 characters',
      'password.confirmed': 'Password confirmation does not match',
      'confirmPassword.required': 'Password confirmation is required',
    };

    try {
      const validatedData = await ctx.request.validate({
        schema: validationSchema,
        messages: messages,
      });

      return {
        token: validatedData.token,
        password: validatedData.password,
      };
    } catch (error) {
      throw new Exception(
        error.messages ? JSON.stringify(error.messages) : "Validation failed",
        422,
        "E_VALIDATION_FAILED"
      );
    }
  }

  // Validate search parameters
  public async searchValidator(ctx: HttpContextContract) {
    const validationSchema = schema.create({
      query: schema.string({}, [
        rules.minLength(2),
        rules.maxLength(100),
      ]),
      page: schema.number.optional([
        rules.unsigned(),
        rules.range(1, 1000),
      ]),
      limit: schema.number.optional([
        rules.unsigned(),
        rules.range(1, 100),
      ]),
    });

    const messages = {
      'query.required': 'Search query is required',
      'query.minLength': 'Search query must be at least 2 characters long',
      'query.maxLength': 'Search query cannot be longer than 100 characters',
      'page.unsigned': 'Page must be a positive number',
      'page.range': 'Page must be between 1 and 1000',
      'limit.unsigned': 'Limit must be a positive number',
      'limit.range': 'Limit must be between 1 and 100',
    };

    try {
      const validatedData = await ctx.request.validate({
        schema: validationSchema,
        messages: messages,
      });
      return validatedData;
    } catch (error) {
      throw new Exception(
        error.messages ? JSON.stringify(error.messages) : "Validation failed",
        422,
        "E_VALIDATION_FAILED"
      );
    }
  }

  // Validate pagination parameters
  public async paginationValidator(ctx: HttpContextContract) {
    const validationSchema = schema.create({
      page: schema.number.optional([
        rules.unsigned(),
        rules.range(1, 1000),
      ]),
      limit: schema.number.optional([
        rules.unsigned(),
        rules.range(1, 100),
      ]),
    });

    const messages = {
      'page.unsigned': 'Page must be a positive number',
      'page.range': 'Page must be between 1 and 1000',
      'limit.unsigned': 'Limit must be a positive number',
      'limit.range': 'Limit must be between 1 and 100',
    };

    try {
      const validatedData = await ctx.request.validate({
        schema: validationSchema,
        messages: messages,
      });
      return {
        page: validatedData.page || 1,
        limit: validatedData.limit || 10,
      };
    } catch (error) {
      throw new Exception(
        error.messages ? JSON.stringify(error.messages) : "Validation failed",
        422,
        "E_VALIDATION_FAILED"
      );
    }
  }
}