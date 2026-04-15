// src/modules/orders/order.controller.js

const orderService = require("./order.service");

const checkout = async (req, res) => {
  try {
    const order = await orderService.checkout(req.user.id);

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

module.exports = {
  checkout,
};