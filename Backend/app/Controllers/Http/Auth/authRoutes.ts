import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  // Public routes (no authentication required)
  Route.post("/register", "authController.register");
  Route.post("/login", "authController.login");
  
  // Check session status (useful for frontend to check if user is logged in)
  Route.get("/check-session", "authController.checkSession");
  
  // Protected routes (require authentication)
  Route.group(() => {
    Route.post("/logout", "authController.logout");
    Route.get("/profile", "authController.profile");
    Route.put("/profile", "authController.updateProfile");
    Route.post("/change-password", "authController.changePassword");
  }).middleware("authSession");
  
})
  .prefix("api/v1/auth")
  .namespace("App/Controllers/Http/Auth");