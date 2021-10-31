const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//MongoDB connection state
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run ()
{
    try {
        //Build mongoDB connection with database collection
        await client.connect();
        const database = client.db('picnic_in_heaven');
        const serviceCollection = database.collection('service');
        const orderCollection = database.collection('order');

        //CREATE service data
        app.post('/service', async (req, res) =>
        {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.json(result);
        });

        //READ service data
        app.get('/service', async (req, res) =>
        {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //READ single service data
        app.get('/service/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        //CREATE order data
        app.post('/order', async (req, res) =>
        {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        });

        //READ order data
        app.get('/order', async (req, res) =>
        {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        });

        //UPDATE order status
        app.put('/order/:id', async (req, res) =>
        {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    orderStatus: updateStatus.orderStatus
                }
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //DELETE order data
        app.delete('/order/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        //READ order data by email
        app.get('/order/:email', async (req, res) =>
        {
            const email = req.params.email;
            const query = { email: { $eq: email } };
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
    }
    finally {
        // await client.close();
    };
};

run().catch(console.dir);

app.get('/', (req, res) =>
{
    res.send('Picnic In Heaven Server is Running');
});

app.listen(port, () =>
{
    console.log('Server running at port', port);
});