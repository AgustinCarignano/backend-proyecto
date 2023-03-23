import { Router } from "express";
import { isAdmin } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

//registro con passport local
router.post(
  "/register",
  passport.authenticate("localRegister", {
    failureRedirect: "/views/register/errorRegister",
    passReqToCallback: true,
  }),
  (req, res) => {
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
);

//login con passport local (verificacion de administrador)
router.post(
  "/login",
  isAdmin,
  passport.authenticate("localLogin", {
    failureRedirect: "/views/login/errorLogin",
    passReqToCallback: true,
  }),
  async (req, res) => {
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
);

//Registro y login con Github
router.get(
  "/githubRegister",
  passport.authenticate("githubRegister", { scope: ["user:email"] })
);
router.get(
  "/github",
  passport.authenticate("githubRegister", {
    failureRedirect: "/views/errorRegistro",
  }),
  (req, res) => {
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
);

//Registro y login con Facebook
router.get(
  "/facebookRegister",
  passport.authenticate("facebookRegister", { scope: "email" })
);
router.get(
  "/facebook",
  passport.authenticate("facebookRegister", {
    failureRedirect: "/views/errorRegister",
  }),
  (req, res) => {
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    } else {
      res.clearCookie("userSession");
      res.clearCookie("client_token");
      res.redirect("/");
    }
  });
});

export default router;
