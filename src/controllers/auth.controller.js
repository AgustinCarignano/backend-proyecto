import usersService from "../services/users.service.js";
import { hashData } from "../utils/bcrypt.utils.js";
import { generateToken, verifyToken } from "../utils/jwt.utils.js";
import CustomError from "../utils/errors/customError.utils.js";
import { ErrorEnums } from "../utils/errors/errors.enums.js";
import { transporter } from "../utils/nodemailer.utils.js";
import passport from "passport";

class AuthController {
  async githubCallback(req, res) {
    const user = req.user;
    const now = new Date();
    await usersService.updateUser(user.email, { last_connection: now });
    req.session.role = user.role;
    req.session.logged = true;
    req.session.isAdmin = false;
    res.redirect("/views/products");
  }
  async localRegister(req, res, next) {
    const user = req.user;
    const now = new Date();
    await usersService.updateUser(user.email, { last_connection: now });
    req.session.role = user.role;
    req.session.logged = true;
    req.session.isAdmin = false;
    res.redirect("/views/products");
  }
  async login(req, res) {
    const user = req.user;
    const now = new Date();
    await usersService.updateUser(user.email, { last_connection: now });
    req.session.role = user.role;
    req.session.logged = true;
    res.redirect("/views/products");
  }
  async logout(req, res) {
    if (!req.session.isAdmin) {
      const now = new Date();
      await usersService.updateUser(req.user.email, { last_connection: now });
    }
    req.session.destroy((error) => {
      if (error) {
        throw new Error(error.message);
      } else {
        res.clearCookie("userSession");
        res.redirect("/");
      }
    });
  }
  async passRecover(req, res) {
    const { email } = req.body;
    try {
      const user = await usersService.getUserByEmail(email);
      if (!user) CustomError.generateError(ErrorEnums.MISSING_VALUES);
      const recoveryToken = await generateToken(user, "1h");
      const mailContent = {
        from: "CoderBackend",
        to: email,
        subject: "Recuperar contrasenia",
        html: `<p>Haz clic en el siguiente <a href="http://localhost:8080/views/newPassword/${recoveryToken}">enlace</a> para restaurar su contrasenia</p>`,
      };
      await transporter.sendMail(mailContent);
      res.render("recovery", { sent: true });
    } catch (error) {
      throw error;
    }
  }
  async newPassword(req, res) {
    const { recovery_token } = req.cookies;
    const { password } = req.body;
    try {
      const { user } = verifyToken(recovery_token);
      const isValidPass =
        (await usersService.validateUser(user.email, password)) instanceof
        Error;
      if (!isValidPass) {
        return res.render("newPassword", {
          auth: true,
          message: "Elige otra contraseña",
        });
      }
      const hashedPassword = hashData(password);
      await usersService.updateUser(user.email, { password: hashedPassword });
      res.redirect("/views/login");
    } catch (error) {
      res.redirect("/login/errorLogin");
    }
  }
}

export default new AuthController();
