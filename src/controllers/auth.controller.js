import usersService from "../services/users.service.js";
import { hashData, compareHashedData } from "../utils/bcrypt.utils.js";
import { generateToken } from "../utils/jwt.utils.js";

class AuthController {
  async facebookCallback(req, res) {
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
  async githubCallback(req, res) {
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
  async jwtRegister(req, res) {
    const { email, password } = req.body;
    const user = await usersService.getUserByEmail(email);
    if (user) return res.redirect("/views/register/errorRegister");
    const hashedPassword = hashData(password);
    const newUser = await usersService.addUser({
      ...req.body,
      password: hashedPassword,
    });
    const token = await generateToken(newUser);
    res.cookie("client_token", token);
    //res.json({ token });
    res.redirect("/api/sessions/current");
  }
  async jwtLogin(req, res) {
    //const user = await usersService.getUserByEmail(email);
    // if (!user) return res.redirect("/views/login/errorLogin");
    //const isCorrectPassword = await compareHashedData(password, user.password);
    //if (!isCorrectPassword) return res.redirect("/views/login/errorLogin");
    //res.json({ token });
    const { email, password } = req.body;
    const validUser = await usersService.validateUser(email, password);
    if (!validUser) return res.redirect("/views/login/errorLogin");
    const token = await generateToken(validUser);
    res.cookie("client_token", token);
    res.redirect("/api/sessions/current");
  }
}

export default new AuthController();
