import { Router } from "express";
import { UserManager } from "../dao/mongoManagers/UserManager.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const userManager = new UserManager();

const router = Router();

router.post("/register", async (req, res) => {
  const { email } = req.body;
  const userExist = await userManager.getUserByEmail(email);
  if (userExist) {
    res.redirect("/views/register/errorRegister");
  } else {
    await userManager.addUser(req.body);
    res.redirect("/views/login");
  }
});

router.post("/login", isAdmin, async (req, res) => {
  const { email, password } = req.body;
  const userExist = await userManager.getUserByEmail(email);
  if (userExist && userExist.password === password) {
    for (const key in req.body) {
      req.session[key] = req.body[key];
    }
    res.cookie(
      "userSession",
      { name: userExist.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  } else {
    res.redirect("/views/login/errorLogin");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    } else {
      res.clearCookie("userSession");
      res.redirect("/");
    }
  });
});

export default router;
