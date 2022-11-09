const express = require('express')
const app = express()
const cors= require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
require('dotenv').config()

// middelware
app.use(cors())
app.use(express.json())

// DB CONNECTION
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.apqupzl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbconnect(){
    try{
        await client.connect();
        console.log("database is connected");
        
    }
    catch(error){
        console.log(error.name, error.message, error.stack);
        res.send({
            success:false,
            error:error.message
        })
    }
}
dbconnect()

// END POIND
const servicesCollection = client.db('photographydb').collection('services2');
const reviewsCollection = client.db('photographydb').collection('reviews');

// ALL SERVICES PAGE SERVICE GET
app.get('/services',async(req,res)=>{
    try{
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
        res.send({
            success:true,
            message:"successfull data",
            data: services
        })

    }
    catch(error){
        console.log(error.name, error.message, error.stack);
        res.send({
            success:false,
            error:error.message
        })
    }
});
// HOME PAGE LIMIT SERVICE GET
app.get('/service',async(req,res)=>{
    try{
        const query = {};
        const cursor = servicesCollection.find(query);
        const service = await cursor.limit(3).toArray();
        res.send({
            success:true,
            message:"successfull data",
            data: service
        })

    }
    catch(error){
        console.log(error.name, error.message, error.stack);
        res.send({
            success:false,
            error:error.message
        })
    }
});
// SINGLE SERVICES
app.get('/services/:id', async(req,res)=>{
    try{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.send(service)
    }
    catch(error){
        console.log(error.name, error.message);
        res.send({
            success:false,
            error:error.message
        })
    }
});
// REVIEWS GET
app.get('/reviews',async(req,res)=>{
    try{
        
        let query = {};
        if(req.query.email){
            query={
                email:req.query.email
            }
        }
        const cursor = reviewsCollection.find(query);
        const reviews = await cursor.toArray();
        res.send({
            success:true,
            message:"successfull data",
            data: reviews
        })

    }
    catch(error){
        console.log(error.name, error.message, error.stack);
        res.send({
            success:false,
            error:error.message
        })
    }
});
// REVIEWS SHOW DETAILS PAGE
app.get('/reviews',async(req,res)=>{
    try{
        console.log(req.query.name)
        let query = {};
        if(req.query.serviceName){
            query={
                name:req.query.serviceName
            }
        }
        const cursor = reviewsCollection.find(query);
        const reviews = await cursor.toArray();
        res.send({
            success:true,
            message:"successfull data",
            data: reviews
        })

    }
    catch(error){
        console.log(error.name, error.message, error.stack);
        res.send({
            success:false,
            error:error.message
        })
    }
});
// REVIEWS INSERT
app.post('/reviews',async(req,res)=>{
    try{
        const review = req.body;
        const results = await reviewsCollection.insertOne(review);
        if(results.insertedId){
            res.send({
                success:true,
                message:`seccussful review ${req.body.serviceName}`
            })
        }else{
            res.send({
                success:false,
                error:'something went wrong review'
            })
        }
    }
    catch(error){
        console.log(error.name, error.message);
        res.send({
            success:false,
            error:error.message
        })
    }
})

app.get('/', (req, res) => {
  res.send('Photography server is running!')
})

app.listen(port, () => {
  console.log(`Assignment 11 photography server site ${port}`)
})