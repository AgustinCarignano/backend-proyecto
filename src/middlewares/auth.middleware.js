import productsService from "../services/products.service.js";
import usersService from "../services/users.service.js";
import CustomError from "../utils/errors/customError.utils.js";
import { ErrorEnums } from "../utils/errors/errors.enums.js";

export function isAdmin(req, res, next) {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.email = "adminCoder@coder.com;";
    req.session.isAdmin = true;
    req.session.logged = true;
    res.redirect("/views/products");
  } else {
    req.session.isAdmin = false;
    next();
  }
}

export async function isOwnerOrAdmin(req, _res, next) {
  if (req.session.isAdmin) return next();
  const { pid } = req.params;
  if (!pid && req.user.role === "premium") return next();
  const { email } = req.user;
  const product = await productsService.getProductById(pid);
  if (product.owner === email) return next();
  else CustomError.generateError(ErrorEnums.UNAUTHORIZED);
}

export function isAdminAuth(req, res, next) {
  if (req.session.isAdmin) next();
  else
    res
      .status(403)
      .json({ message: "Unauthorized to get access to this endpoint" });
}

export async function isUserAuth(req, _res, next) {
  if (req.session.isAdmin) CustomError.generateError(ErrorEnums.UNAUTHORIZED);
  const { cid } = req.params;
  const { email } = req.user;
  const user = await usersService.getUserByEmail(email);
  if (user.cart !== cid) CustomError.generateError(ErrorEnums.UNAUTHORIZED);
  return next();
}
