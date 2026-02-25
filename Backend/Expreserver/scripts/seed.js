import 'dotenv/config'
import pool from "../db/postgres.js";
import { faker } from "@faker-js/faker";

const CLOTH_SIZES = ["XS","S","M","L","XL"];
const SHOE_SIZES = ["40","41","42","43","44"];
const BRANDS = ["Nike","Adidas","Puma","Zara","H&M","Uniqlo"];
const CATEGORIES = ["tshirt","hoodie","jeans","shoes","jacket"];

/* USERS + SIZES + PREFS */
async function createUsers(count=25){
  for(let i=0;i<count;i++){
    const user = await pool.query(
      `INSERT INTO users (name,email)
       VALUES ($1,$2) RETURNING id`,
      [faker.person.fullName(),faker.internet.email()]
    );

    const uid=user.rows[0].id;

    await pool.query(
      `INSERT INTO user_sizes (user_id,category,size_value,size_system)
       VALUES ($1,$2,$3,$4)`,
      [uid,"tshirt",faker.helpers.arrayElement(CLOTH_SIZES),"INT"]
    );

    await pool.query(
      `INSERT INTO user_sizes (user_id,category,size_value,size_system)
       VALUES ($1,$2,$3,$4)`,
      [uid,"shoes",faker.helpers.arrayElement(SHOE_SIZES),"EU"]
    );

    for(let j=0;j<3;j++){
      await pool.query(
        `INSERT INTO user_preferences (user_id,brand,category,weight,source)
         VALUES ($1,$2,$3,$4,$5)`,
        [
          uid,
          faker.helpers.arrayElement(BRANDS),
          faker.helpers.arrayElement(CATEGORIES),
          faker.number.int({min:1,max:5}),
          "stated"
        ]
      );
    }
  }
}

/* PRODUCTS + VARIANTS */
async function createProducts(count=80){
  for(let i=0;i<count;i++){
    const category=faker.helpers.arrayElement(CATEGORIES);

    const product=await pool.query(
      `INSERT INTO products (name,brand,category,description,price,trend_score)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [
        faker.commerce.productName(),
        faker.helpers.arrayElement(BRANDS),
        category,
        faker.commerce.productDescription(),
        faker.number.int({min:700,max:6000}),
        faker.number.int({min:1,max:100})
      ]
    );

    const pid=product.rows[0].id;
    const sizes = category==="shoes"?SHOE_SIZES:CLOTH_SIZES;

    for(const size of sizes){
      await pool.query(
        `INSERT INTO product_variants (product_id,category,size_value,size_system,stock)
         VALUES ($1,$2,$3,$4,$5)`,
        [pid,category,size,category==="shoes"?"EU":"INT",faker.number.int({min:0,max:20})]
      );
    }
  }
}

/* PURCHASES + RETURNS */
async function simulatePurchases(){
  const users = await pool.query('SELECT id FROM users');
  const variants = await pool.query('SELECT id FROM product_variants');

  for(let i=0;i<250;i++){
    const purchase=await pool.query(
      `INSERT INTO purchases (user_id,variant_id)
       VALUES ($1,$2) RETURNING id`,
      [
        faker.helpers.arrayElement(users.rows).id,
        faker.helpers.arrayElement(variants.rows).id
      ]
    );

    const returned = Math.random() < 0.25;

    await pool.query(
      `INSERT INTO returns (purchase_id,returned,returned_at)
       VALUES ($1,$2,$3)`,
      [purchase.rows[0].id,returned,returned?faker.date.recent():null]
    );
  }
}

/* REVIEWS */
async function createReviews(){
  const users = await pool.query('SELECT id FROM users');
  const products = await pool.query('SELECT id FROM products');

  for(let i=0;i<200;i++){
    await pool.query(
      `INSERT INTO reviews (user_id,product_id,rating,comment)
       VALUES ($1,$2,$3,$4)`,
      [
        faker.helpers.arrayElement(users.rows).id,
        faker.helpers.arrayElement(products.rows).id,
        faker.number.int({min:1,max:5}),
        faker.lorem.sentence()
      ]
    );
  }
}

async function seed(){
  console.log("Seeding database...");
  await createUsers();
  await createProducts();
  await simulatePurchases();
  await createReviews();
  console.log("Done!");
  await pool.end();
}

seed();