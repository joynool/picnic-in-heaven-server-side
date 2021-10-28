const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
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