const dashboardService = require("./admin.dashboard.service");

const getDashboardStats = async (req, res, next) => {
    try {
        const data = await dashboardService.getDashboardStats();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getDashboardAnalytics = async (req, res, next) => {
    try {
        const { range = "30d" } = req.query;

        const data = await dashboardService.getDashboardAnalytics(range);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getDashboardTables = async (req, res, next) => {
  try {
    const { range = "30d" } = req.query;

    const data = await dashboardService.getDashboardTables(range);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
    getDashboardStats,
    getDashboardAnalytics,
    getDashboardTables,
};