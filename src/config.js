import dotenv from "dotenv";

dotenv.config();

const data = {
  node_env: process.env.NODE_ENV || "",
  port: process.env.PORT,
  uri: process.env.URI,
  cookieKey: process.env.COOKIE_KEY,
  sessionKey: process.env.SESSION_KEY,
  saltOrRound: process.env.SALT_OR_ROUND,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  secretOrKey: process.env.SECRET_OR_KEY,
  gmail: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  userInactiveTime: process.env.USER_INACTIVE_TIME,
};

export default data;
