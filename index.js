const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run ()
{
    try {
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
            const result = await serviceCollection.insertOne(newOrder);
            res.json(result);
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