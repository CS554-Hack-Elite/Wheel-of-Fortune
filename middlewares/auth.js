// Referenced from: https://dev.to/earthcomfy/build-authentication-using-firebase-react-express-28ig

import auth from "../config/firebaseConfig.js";

export const VerifyToken = async (req, res, next) => {
  console.log("middleware");

  // Special accesss for admin login
  if (!req.originalUrl.startsWith("/users")) {
    return next();
  }

  // Special access for the register route
  if (req.originalUrl.startsWith("/users/register")) {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
  } catch (e) {
    return res.json({ message: "Firebase Authentication Error" });
  }
};
