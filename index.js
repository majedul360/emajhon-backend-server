const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connection with database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpjjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  await client.connect();
  const emajonCollection = client.db("emajhon").collection("products");
  try {
    // get all data from database
    app.get("/products", async (req, res) => {
      const btnNumber = parseInt(req.query.btnNumber);
      //   const productPerPage = parseInt(req.query.productPerPage);

      const filter = emajonCollection.find({});

      const products = await filter
        .skip(btnNumber * 10)
        .limit(10)
        .toArray();

      res.send(products);
    });

    // count products
    app.get("/product-total", async (req, res) => {
      const total = await emajonCollection.estimatedDocumentCount();
      res.send({ total });
    });

    // post product and load by keys
    app.post("/productByKeys", async (req, res) => {
      const ProductKeys = req.body;
      const idS = ProductKeys.map((id) => ObjectId(id));
      const query = { _id: { $in: idS } };
      const filter = emajonCollection.find(query);
      const result = await filter.toArray();
      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log("server port number", port);
});
