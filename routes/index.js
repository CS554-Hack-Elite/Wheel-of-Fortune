import customerRoutes from "./customer.js";
// import businessRoutes from "./business.js";

const constructorMethod = (app) => {
  app.use("/", customerRoutes);
//   app.use("/admin/business/", businessRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
};

export default constructorMethod;
