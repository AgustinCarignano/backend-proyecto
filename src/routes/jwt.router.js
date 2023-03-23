import { Router } from "express";
import passport from "passport";
import { UserManager } from "../dao/mongoManagers/UserManager.js";
import { generateToken, hashPassword } from "../utils.js";

const router = Router();
const userManager = new UserManager();

//Registro con jwt
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const user = await userManager.getUserByEmail(email);
  if (user) return res.redirect("/views/register/errorRegister");
  const hashedPassword = hashPassword(password);
  const newUser = await userManager.addUser({
    ...req.body,
    password: hashedPassword,
  });
  const token = generateToken(newUser);
  res.cookie("client_token", token, { signed: true });
  res.render("showToken", { token });
});

//Login con jwt
router.post(
  "/login",
  passport.authenticate("jwtLogin", {
    failureRedirect: "/views/login/errorLogin",
    passReqToCallback: true,
  }),
  async (req, res) => {
    const { email, password } = req.user;
    const user = await userManager.getUserByEmail(email);
    if (user.password !== password)
      return res.redirect("/views/login/errorLogin");
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
);

export default router;
