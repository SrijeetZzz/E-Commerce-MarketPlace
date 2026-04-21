// const User = require("../auth/auth.model");

// // 🔥 GET ALL ADDRESSES
// const getAddresses = async (userId) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new Error("User not found");
//   }

//   return user.addresses;
// };

// // 🔥 ADD ADDRESS
// const addAddress = async (userId, data) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new Error("User not found");
//   }

//   // ❌ prevent manual default injection
//   delete data.isDefault;

//   // basic validation
//   if (!data.fullName || !data.phone || !data.street) {
//     throw new Error("Missing required fields");
//   }

//   // if first address → make default
//   if (user.addresses.length === 0) {
//     data.isDefault = true;
//   }

//   user.addresses.push(data);
//   await user.save();

//   return user.addresses;
// };

// // 🔥 SET DEFAULT
// const setDefaultAddress = async (userId, addressId) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new Error("User not found");
//   }

//   let found = false;

//   user.addresses.forEach((addr) => {
//     if (addr._id.toString() === addressId) {
//       addr.isDefault = true;
//       found = true;
//     } else {
//       addr.isDefault = false;
//     }
//   });

//   if (!found) {
//     throw new Error("Address not found");
//   }

//   await user.save();

//   return user.addresses;
// };

// // 🔥 UPDATE ADDRESS
// const updateAddress = async (userId, addressId, data) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const address = user.addresses.id(addressId);

//   if (!address) {
//     throw new Error("Address not found");
//   }

//   // ❌ prevent default manipulation
//   delete data.isDefault;

//   // update only allowed fields
//   address.fullName = data.fullName ?? address.fullName;
//   address.phone = data.phone ?? address.phone;
//   address.street = data.street ?? address.street;
//   address.city = data.city ?? address.city;
//   address.state = data.state ?? address.state;
//   address.pincode = data.pincode ?? address.pincode;

//   await user.save();

//   return user.addresses;
// };

// // 🔥 DELETE ADDRESS
// const deleteAddress = async (userId, addressId) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const addr = user.addresses.id(addressId);

//   if (!addr) {
//     throw new Error("Address not found");
//   }

//   const wasDefault = addr.isDefault;

//   addr.deleteOne();

//   // if default removed → assign first as default
//   if (wasDefault && user.addresses.length > 0) {
//     user.addresses[0].isDefault = true;
//   }

//   await user.save();

//   return user.addresses;
// };

// module.exports = {
//   getAddresses,
//   addAddress,
//   setDefaultAddress,
//   updateAddress,
//   deleteAddress,
// };

const User = require("../auth/auth.model");

// 🔥 GET
const getAddresses = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  return user.addresses || [];
};

// 🔥 ADD
const addAddress = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  if (!user.addresses) user.addresses = [];

  // ❌ block manual default
  delete data.isDefault;

  // 🔥 ensure only ONE default
  user.addresses.forEach((addr) => (addr.isDefault = false));

  // first address → default
  data.isDefault = user.addresses.length === 0;

  // 🔥 IMPORTANT: clone object
  user.addresses.push({ ...data });

  await user.save();

  return user.addresses;
};

// 🔥 SET DEFAULT
const setDefaultAddress = async (userId, addressId) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  let found = false;

  user.addresses.forEach((addr) => {
    if (addr._id.toString() === addressId) {
      addr.isDefault = true;
      found = true;
    } else {
      addr.isDefault = false;
    }
  });

  if (!found) throw new Error("Address not found");

  await user.save();

  return user.addresses;
};

// 🔥 UPDATE
const updateAddress = async (userId, addressId, data) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const addr = user.addresses.id(addressId);

  if (!addr) throw new Error("Address not found");

  delete data.isDefault;

  addr.fullName = data.fullName ?? addr.fullName;
  addr.phone = data.phone ?? addr.phone;
  addr.street = data.street ?? addr.street;
  addr.city = data.city ?? addr.city;
  addr.state = data.state ?? addr.state;
  addr.pincode = data.pincode ?? addr.pincode;

  await user.save();

  return user.addresses;
};

// 🔥 DELETE
const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const addr = user.addresses.id(addressId);

  if (!addr) throw new Error("Address not found");

  const wasDefault = addr.isDefault;

  addr.deleteOne();

  // 🔥 reassign default if needed
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  return user.addresses;
};

module.exports = {
  getAddresses,
  addAddress,
  setDefaultAddress,
  updateAddress,
  deleteAddress,
};