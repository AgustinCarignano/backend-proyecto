class SessionController {
  authUser(req, res) {
    const user = req.user;
    res.json({ message: "Authorized user", user });
  }
  async openSession(req, res) {
    res.cookie(
      "userSession",
      { name: req.user.fullName, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
  async closeSession(req, res) {
    req.session.destroy((error) => {
      if (error) {
        console.log(error);
      } else {
        res.clearCookie("userSession");
        res.clearCookie("client_token");
        res.redirect("/");
      }
    });
  }
}

export default new SessionController();
