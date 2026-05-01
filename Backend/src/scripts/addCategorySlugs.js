require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../modules/categories/category.model");

function slugify(name) {
 return name
   .toLowerCase()
   .replace(/&/g,"and")
   .replace(/[^\w\s-]/g,"")
   .trim()
   .replace(/\s+/g,"-");
}

async function run() {
 await mongoose.connect(process.env.MONGO_URI);

 const categories = await Category.find();

 for (let category of categories) {

   let baseSlug = slugify(category.name);
   let slug = baseSlug;
   let count = 1;

   // handle duplicate names
   while(await Category.findOne({
      slug,
      _id: { $ne: category._id }
   })) {
      slug = `${baseSlug}-${count++}`;
   }

   category.slug = slug;
   await category.save();

   console.log(`${category.name} -> ${slug}`);
 }

 console.log("done");
 process.exit();
}

run();