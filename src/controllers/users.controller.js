import usersService from "../services/users.service.js";
import { transporter } from "../utils/nodemailer.utils.js";

class UsersController {
  async getAllUsers(_req, res) {
    const users = await usersService.getAllUsers();
    res.json({ message: "Success getting all users", users });
  }
  async saveDocuments(req, res) {
    const user = req.user;
    const files = req.files;
    const documents = [];
    for (const key in files) {
      documents.push(...files[key]);
    }
    const newDocuments = documents.map((item) => ({
      name: item.fieldname.split("-")[1],
      reference: item.path,
    }));
    const newInfoToUser = { documents: [...user.documents, ...newDocuments] };
    const updatedUser = await usersService.updateUser(
      user.email,
      newInfoToUser
    );
    req.user = updatedUser;
    res.redirect("/views/clientArea");
  }
  async upgradeUser(req, res) {
    const user = req.user;
    const essentialDocuments = ["identification", "address", "account"];
    const existingDocuments = user.documents.map((item) => item.name);
    let hasToUpgrade = true;
    essentialDocuments.forEach((item) => {
      if (!existingDocuments.includes(item)) hasToUpgrade = false;
    });
    if (hasToUpgrade) {
      const updatedUser = await usersService.updateUser(user.email, {
        ...user,
        role: "premium",
      });
      req.user = updatedUser;
      res.redirect("/views/clientArea");
    } else {
      res.redirect("/views/clientArea");
    }
  }
  async decreaseUser(req, res) {
    const { uid } = req.params;
    const updatedUser = await usersService.updateUserWithId(uid, {
      role: "user",
      documents: [],
    });
    req.user = updatedUser;
    res.clearCookie("userSession").redirect("/api/sessions/current");
  }
  async deleteUser(req, res) {
    const { uid } = req.params;
    const loggedUser = req.user;
    if (loggedUser && loggedUser.id === uid) {
      req.session.destroy((error) => {
        if (error) {
          throw new Error(error.message);
        } else {
          res.clearCookie("userSession");
        }
      });
    }
    const user = await usersService.deleteUser(uid);
    const mailContent = {
      from: "CoderBackend",
      subject: "Cuenta eliminada",
      to: user.email,
      html: `<p>Se ha eliminado su cuenta de la aplicacion de Coder por inactividad.</p>`,
    };
    await transporter.sendMail(mailContent);
    res.json({ message: "User deleted", user });
  }
  async deleteInactiveUsers(_req, res) {
    const { deleted, users } = await usersService.deleteInactiveUsers();
    const mailContent = {
      from: "CoderBackend",
      subject: "Cuenta eliminada",
      html: `<p>Se ha eliminado su cuenta de la aplicacion de Coder por inactividad.</p>`,
    };
    if (deleted) {
      users.forEach(
        async (email) =>
          await transporter.sendMail({ ...mailContent, to: email })
      );
      res.json({ message: "cuentas eliminadas con exito", users });
    }
  }
}

export default new UsersController();
