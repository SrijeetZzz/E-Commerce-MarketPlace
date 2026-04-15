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
const processPayment = async (req, res) => {
  try {
    const { success } = req.body;

    const order = await orderService.processPayment(
      req.params.id,
      success
    );

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

module.exports = {
  checkout,
  processPayment,
};