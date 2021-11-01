const express = require('express');
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config()
const app = express();
const port = 5000;

//middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o1vd8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("travalAgency");
        const servicesCollection = database.collection("services");

        //get API

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get single service

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        //post API

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitting the post', service);


            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        })

        //delete

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })





    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running it')
});

app.listen(port, () => {
    console.log('Running mu website')
});

//uPVxhPEApJZq9EL0