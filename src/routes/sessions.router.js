import { Router } from "express";
import passport from "passport";
import { UserManager } from "../dao/mongoManagers/UserManager.js";
import { hashPassword, generateToken } from "../utils.js";

const router = Router();
const userManager = new UserManager();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const user = await userManager.getUserByEmail(email);
  if (user)
    return res
      .status(400)
      .json({ message: "Ya existe un ususario regisrado con ese email" });
  const hashedPassword = hashPassword(password);
  const newUser = await userManager.addUser({
    ...req.body,
    password: hashedPassword,
  });
  const token = generateToken(newUser);
  res.json({ message: "Usuario creado con exito", token });
});

router.get(
  "/current",
  passport.authenticate("current", {
    failureMessage: "No se encuentra un usuario asignado a ese token",
    passReqToCallback: true,
  }),
  (req, res) => {
    res.json({ message: "Usuario encontrado", user: req.user });
  }
);

export default router;
