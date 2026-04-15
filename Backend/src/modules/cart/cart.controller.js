// src/modules/cart/cart.controller.js

const cartService = require("./cart.service");

const add = async (req, res) => {
  try {
    const data = await cartService.addToCart(req.user.id, req.body);
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const get = async (req, res) => {
  try {
    const data = await cartService.getCart(req.user.id);
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = await cartService.updateCartItem(
      req.user.id,
      req.body.listingId,
      req.body.quantity
    );
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const data = await cartService.removeFromCart(
      req.user.id,
      req.params.listingId
    );
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  add,
  get,
  update,
  remove,
};