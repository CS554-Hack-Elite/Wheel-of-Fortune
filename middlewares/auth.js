// Referenced from: https://dev.to/earthcomfy/build-authentication-using-firebase-react-express-28ig

import auth from "../config/firebaseConfig.js";

export const VerifyToken = async (req, res, next) => {
  console.log("middleware");

  if (req.originalUrl.startsWith("/admin")) {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      // console.log("authenticated");
      return next();
    }
  } catch (e) {
    return res.json({ message: "Firebase Authentication Error" });
  }
};
