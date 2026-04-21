const addressService = require("./address.service");

// GET
const getAddresses = async (req, res) => {
  try {
    const data = await addressService.getAddresses(req.user.id);
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ADD
const addAddress = async (req, res) => {
  try {
    const data = await addressService.addAddress(
      req.user.id,
      req.body
    );
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// SET DEFAULT
const setDefault = async (req, res) => {
  try {
    const data = await addressService.setDefaultAddress(
      req.user.id,
      req.params.id
    );
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
const updateAddress = async (req, res) => {
  try {
    const data = await addressService.updateAddress(
      req.user.id,
      req.params.id,
      req.body
    );
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
const deleteAddress = async (req, res) => {
  try {
    const data = await addressService.deleteAddress(
      req.user.id,
      req.params.id
    );
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  setDefault,
  updateAddress,
  deleteAddress,
};