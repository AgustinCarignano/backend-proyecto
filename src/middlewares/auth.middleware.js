/* export function isNotLogged(req, res, next) {
  if (req.session.logged) {
    next();
  } else {
    const token = req?.cookies?.client_token;
    if (!token) return res.redirect("/views/login");
    res.redirect("/api/users/verifyToken");
  }
}

export function isLogged(req, res, next) {
  if (req.session.logged) {
    res.redirect("/views/products");
  } else {
    next();
  }
} */

export function isAdmin(req, res, next) {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    for (const key in req.body) {
      req.session[key] = req.body[key];
    }
    res.cookie(
      "userSession",
      { name: "Coder", rol: "admin" },
      { signed: true }
    );
    req.session.isAdmin = true;
    req.session.logged = true;
    res.redirect("/views/products");
  } else {
    req.session.isAdmin = false;
    next();
  }
}

export function isAdminAuth(req, res, next) {
  if (req.session.isAdmin) next();
  else
    res
      .status(403)
      .json({ message: "Unauthorized to get access to this endpoint" });
}

export function isUserAuth(req, res, next) {
  if (!req.session.isAdmin) next();
  else
    res
      .status(403)
      .json({ message: "Unauthorized to get access to this endpoint" });
}
