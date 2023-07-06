import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/githubRegister",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/githubCallback",
  passport.authenticate("github", {
    failureRedirect: "/views/errorRegister",
  }),
  authController.githubCallback
);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/views/register/errorRegister",
  }),
  authController.localRegister
);

router.post(
  "/login",
  isAdmin,
  passport.authenticate("login", {
    failureRedirect: "/views/login/errorLogin",
  }),
  authController.login
);

router.get("/logout", authController.logout);

router.post("/recovery", authController.passRecover);

router.post("/recovery/newPassword", authController.newPassword);

export default router;
