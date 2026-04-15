require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db.config");
const startOrderTimeoutJob = require("./shared/cron/orderTimeout.job");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    startOrderTimeoutJob();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();