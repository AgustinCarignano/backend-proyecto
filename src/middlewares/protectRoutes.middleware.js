export function isNotLogged(req, res, next) {
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
}
