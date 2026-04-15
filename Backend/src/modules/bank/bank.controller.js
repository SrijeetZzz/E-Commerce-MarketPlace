// src/modules/bank/bank.controller.js

const bankService = require("./bank.service");

// ================= SELLER =================

// submit bank details
const submit = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const result = await bankService.submitBankDetails(sellerId, req.body);

    res.status(201).json({
      message: "Bank details submitted",
      data: result,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get own bank details
const getMy = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const data = await bankService.getMyBankDetails(sellerId);

    res.json({ data });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ================= ADMIN =================

// verify bank details
const verifyBank = async (req, res) => {
  try {
    const result = await bankService.verifyBank(req.params.id);

    res.json({
      message: "Bank verified",
      data: result,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// reject bank details
const rejectBank = async (req, res) => {
  try {
    const result = await bankService.rejectBank(
      req.params.id,
      req.body.reason
    );

    res.json({
      message: "Bank rejected",
      data: result,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  // seller
  submit,
  getMy,

  // admin
  verifyBank,
  rejectBank,
};