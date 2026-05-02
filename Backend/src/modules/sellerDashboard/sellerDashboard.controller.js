const dashboardService = require("./sellerDashboard.service");

const getDateRange = (range) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case "last_month":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "last_3_months":
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case "last_6_months":
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { startDate, endDate: new Date() };
};

exports.getSummary = async (req, res) => {
  try {
    const sellerId = req.user.id;
    console.log("JWT USER:", req.user);
    console.log("SELLER ID USED:", sellerId);
    const range = req.query.range;

    const { startDate, endDate } = getDateRange(range);

    const data = await dashboardService.getDashboardSummary(
      sellerId,
      startDate,
      endDate,
    );

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
    });
  }
};
exports.getOrdersOverTime = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const range = req.query.range;

    const { startDate, endDate } = getDateRange(range);

    const data = await dashboardService.getOrdersOverTime(
      sellerId,
      startDate,
      endDate
    );

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders over time"
    });
  }
};
exports.getRevenueOverTime = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const range = req.query.range;

    const { startDate, endDate } = getDateRange(range);

    const data = await dashboardService.getRevenueOverTime(
      sellerId,
      startDate,
      endDate
    );

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue over time"
    });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { range, categoryId, subCategoryId } = req.query;

    const { startDate, endDate } = getDateRange(range);

    const data = await dashboardService.getTopProducts(
      sellerId,
      startDate,
      endDate,
      categoryId,
      subCategoryId
    );

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top products"
    });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const data = await dashboardService.getRecentOrders(sellerId);

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders"
    });
  }
};