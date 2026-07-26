const orderService = require("./order.service");
const OrderStatusHistory = require("./orderStatusHistory.model");
/* -----------------------------
BUYER
------------------------------ */

const checkout = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      throw new Error("Address is required");
    }

    const order = await orderService.checkout(req.user.id, address);

    res.status(201).json({
      message: "Order placed",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const processPayment = async (req, res) => {
  try {
    const { success } = req.body;

    const order = await orderService.processPayment(req.params.id, success);

    res.json({
      message: "Payment processed",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const data = await orderService.getMyOrders(req.user.id);

    res.json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const data = await orderService.getOrderById(req.user.id, req.params.id);

    res.json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/* -----------------------------
SELLER
------------------------------ */
const getSellerOrders = async (req, res) => {
  try {
    const data = await orderService.getSellerOrders(req.user.id, req.query);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const data = await orderService.updateOrderItemStatus(
      req.user.id,
      req.params.orderId,
      req.params.itemId,
      status,
    );

    res.json({
      success: true,
      message: "Order item updated",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderItemTimeline = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const history = await OrderStatusHistory.find({
      orderId,
      itemId,
    })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      success: true,
      data: history,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch timeline",
    });
  }
};

/* -----------------------------
ADMIN
------------------------------ */

// const getAdminOrders = async (req, res) => {
//   try {
//     const data = await orderService.getAdminOrders(req.query);

//     res.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
const getAdminOrders = async (req, res) => {
  try {
    const result = await orderService.getAdminOrders(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminOrderById = async (req, res) => {
  try {
    const data = await orderService.getAdminOrderById(req.params.id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const data = await orderService.updateOrderStatus(
      req.params.id,
      status
    );

    res.json({
      success: true,
      message: "Order updated successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  // buyer
  checkout,
  processPayment,
  getMyOrders,
  getOrderById,

  // seller
  getSellerOrders,
  updateOrderItemStatus,
  getOrderItemTimeline,

  //admin
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus

};


