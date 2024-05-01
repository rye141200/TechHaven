exports.renderDashboardUI = async (req, res) => {
  try {
    const connection = require("./../server");
    const databaseHandler = require("./databaseHandler");
    const orders = JSON.parse(
      JSON.stringify(await databaseHandler.getOrdersAdmin(req, res, connection))
    );
    const deposits = JSON.parse(
      JSON.stringify(
        await databaseHandler.getDepositsAdmin(req, res, connection)
      )
    );

    res.status(200).render("adminDashboard", { orders, deposits });
  } catch (err) {
    res.status(400).redirect("/admin");
  }
};
