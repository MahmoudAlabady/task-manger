const mongodb =require('mongodb')
//Intalize connection
const mongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manger'

mongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if (error){
        return console.log('error');
    }
    console.log('Success');

    const db = client.db(dbName);

    const ObjectId = mongodb.ObjectId;

//     db.collection('users').insertMany([{
//         name:'abady',
//         age:28,
//         email:'gfg',
//         completed:true
//     },{  name:'a3bady',
//     age:238,
//     email:'email',
//     completed:false
// },
//     {  name:'a32bady',
//     age:258,
//     email:'emhail',
//     completed:true}
// ],(error,data)=>{
//         if(error){
//             return console.log('error')
//         }
//         console.log(data.insertedCount)
//     })
// db.collection('users').updateOne({_id:new ObjectId('61e8e647908c36979b26bd9c')},
// {
//     $set:{name:'dada'},
//     $inc:{age:2}
// }).then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })

db.collection('users').updateMany({},
    {
        $set:{completed:false}
    }
    ).then((result)=>{
        console.log(result)
    }

    ).catch((error)=>{
        console.log(error)

    })

})
