const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.MDB_USERNAME}:${process.env.MDB_PASSWORD}@cluster0.4plofch.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const productsCollection = client.db('emajon').collection('product')

    app.get('/products', async (req, res) => {
      console.log(req.query)
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const skip = page * limit;
      const result = await productsCollection.find().skip(skip).limit(limit).toArray()
      res.send(result)
    })

    app.get('/totalProducts', async (req, res) => {
      const result = await productsCollection.estimatedDocumentCount()
      res.send({ totalProducts: result })
    })

    app.post('/productsById', async(req, res) => {
      const ids = req.body;
      console.log(ids)
      const objectId = ids.map(id => new ObjectId(id))
      const query = {_id: {$in: objectId}}
      const result = await productsCollection.find(query).toArray()
      res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Ema and Jon going to shopping')
})

app.listen(port, () => {
  console.log(`emajon web running on port: ${port}`)
})
