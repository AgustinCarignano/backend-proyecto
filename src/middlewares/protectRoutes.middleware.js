export function isNotLogged(req, res, next) {
  if (req.session.logged) {
    next();
  } else {
    res.redirect("/views/login");
  }
}

export function isLogged(req, res, next) {
  if (req.session.logged) {
    res.redirect("/views/products");
  } else {
    next();
  }
}
