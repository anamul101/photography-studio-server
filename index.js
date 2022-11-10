const express = require('express')
const app = express()
const cors= require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config()

// middelware
app.use(cors())
app.use(express.json())

// jwt
function verifyjwt(req,res,next){
    const authorizeJwt = req.headers.authorization;
    if(!authorizeJwt){
       return res.status(401).send({message: 'Unauthorize access'});
    }
    const token = authorizeJwt.split(' ')[1];
    jwt.verify(token, process.env.USER_TOKEN, function(err,decoded){
        if(err){
           return res.status(403).send({message: 'Unauthorize access'});
        }
        req.decoded = decoded;
        next();
    })
}

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

app.post('/jwt', (req,res)=>{
    try{
        const user = req.body;
        const token = jwt.sign(user, process.env.USER_TOKEN, {expiresIn: '1d'});
        res.send({token});
    }
    catch(error){
        res.send({
            success:false,
            error:error.message
        })
    }
})

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
// ADD SERVICE
app.post('/services',async(req,res)=>{
    try{
        const addsrc = req.body;
        const results = await servicesCollection.insertOne(addsrc);
        console.log(results);
        if(results.insertedId){
            res.send({
                success:true,
                message:'Succesfull added your service'
            })
        }else{
            res.send({
                success:false,
                error:'something went wrong add service'
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
});
// REVIEWS GET
app.get('/reviews',verifyjwt,async(req,res)=>{
    try{
        const decoded = req.decoded;
        if(decoded.email !== req.query.email){
            res.status(401).send({message: 'Unauthorize access'})
        }
        
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
        console.log(req.query.serviceName)
        let query = {};
        if(req.query.serviceName){
            query={
                serviceName:req.query.serviceName
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
});
// review delete
app.delete('/reviews/:id', async(req,res)=>{
    const {id}= req.params;
    try{
        
        const results = await reviewsCollection.deleteOne({_id:ObjectId(id)});
        if(results.deletedCount){
            res.send({
                success:true,
                message:'Your review deleted successfull'
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
// update reviews
app.get('/reviews/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        const results = await reviewsCollection.findOne({_id:ObjectId(id)});
        res.send({
            success:true,
            data:results
        })
    }
    catch(error){
        console.log(error.name, error.message);
        res.send({
            success:false,
            error:error.message
        })
    }
})
// patch
app.put('/reviews/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        const results = await reviewsCollection.updateOne({_id:ObjectId(id)},{$set: req.body});
        if(results.matchedCount){
            res.send({
                success:true,
                message:'Review Updated succesful'
            })
        }else{
            res.send({
                success:false,
                error:'something went wrong review update'
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