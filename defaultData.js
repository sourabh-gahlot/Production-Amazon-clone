const Products = require("./models/productSchema");
const productsData = require("./constant/productsData");

const DefaultData = async () => {
  try {
    await Products.deleteMany({});
    const storeData = await Products.insertMany(productsData);
    // console.log(storeData);
  } catch (error) {
    throw new Error("error" + err.message);
  }
};

module.exports = DefaultData;
