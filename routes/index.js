import userRoutes from "./customer.js";
import authRoutes from "./auth.js";
import adminRoutes from "./admin.js";

const constructorMethod = (app) => {

  app.use("/users/", userRoutes);
  app.use("/auth/", authRoutes);
  app.use("/admin/", adminRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
};

export default constructorMethod;
