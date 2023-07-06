import handlebars from "express-handlebars";
import config from "../config.js";

export const hbs = handlebars.create({
  helpers: {
    isUser: function (role) {
      return role === "user";
    },
    isPremium: function (role) {
      return role === "premium";
    },
    subTotal: (price, q) => {
      return price * q;
    },
    totalCart: (products) => {
      const subTotalArr = products.map(
        (item) => item.product.price * item.quantity
      );
      const total = subTotalArr.reduce((acum, curr) => acum + curr, 0);
      return total;
    },
    formatDate: (date) => {
      date = date ? date : new Date();
      return date.toLocaleString();
    },
    isInactive: (date) => {
      const today = new Date().getTime();
      const lastConection = date ? date.getTime() : new Date().getTime();
      return today - lastConection > 60000 * config.userInactiveTime;
    },
    totalInactives: (users) => {
      const today = new Date().getTime();
      const inactives = users.filter((item) => {
        const lastConection = item.last_connection
          ? item.last_connection.getTime()
          : new Date().getTime();
        return today - lastConection > 60000 * config.userInactiveTime;
      });
      return inactives.length;
    },
  },
});
