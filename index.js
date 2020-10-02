const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.cr2af.mongodb.net/
${process.env.DB_name}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const productsCollection = client.db("ema-john-simpleStore").collection("products");
  const ordersCollection = client.db("ema-john-simpleStore").collection("orders");

  app.post('/addProduct',(req , res) => {
    console.log("database collection");
      const products = req.body;
      console.log(products);
      productsCollection.insertMany(products)
      .then(result => {
          console.log(result.insertedCount)
          res.send(result.insertedCount);
      })
  })

  app.get('/products',(req, res) => {
      productsCollection.find({}).limit(9)
      .toArray((err,document) => {
          res.send(document)
      }) 
  })

app.get('/products/:key',(req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err,document) => {
        res.send(document[0])
    }) 
})

app.post('/productKeys',(req , res)  => {
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray ((err,document) => {
        res.send(document)
    })
})

app.post('/addOrders',(req , res) => {
    console.log("database collection order OK");
      const order = req.body;
      console.log(order);
      ordersCollection.insertOne(order)
      .then(result => {
          console.log(result.insertedCount)
          res.send(result.insertedCount > 0);
      })
  })

});


app.listen(port);