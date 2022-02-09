const express = require('express');
const router = new express.Router(); 
const User = require('../models/user');
const auth = require('../middelware/auth')
const multer = require('multer')

//post users(sign up)
// router.post('/users', (req,res)=>{
//     // console.log(req.body)
//     const userData =req.body;
//     const user = new User(userData);
//     user.save().then(()=>{
//         res.status(200).send(user)
//     }).catch((error)=>{
//         res.status(400).send(error)
//     })
// })
router.post('/users', async(req,res)=>{
    try {
    const userData =req.body;
    const user = new User(userData);
    const token = await user.generateToken();
    await user.save();
    res.status(200).send({user,token});
   
    } catch (error) {
     res.status(400).send(error)

    }
})


//login
router.post('/users/login', async (req,res)=>{

    try {
        const userData =req.body;

        const user = await User.findByCredentials(userData.email, userData.password)
        const token = await user.generateToken();
        res.status(200).send({user,token});
    } catch (error) {
        res.status(400).send('e'+error)
    }
})

//get all users
router.get('/users',auth,(req,res)=>{
   User.find({}).then((users)=>{
       res.status(200).send(users)
   }).catch((error)=>{
       res.status(500).send(error)
   })
})

//profile
router.get('/profile',auth,(req,res)=>{
    res.send(req.user)
})

//get by id
router.get('/users/:id',auth,(req,res)=>{
      const _id = req.params.id;
      User.findById(_id).then((user)=>{
          if(!user){
              return res.status(404).send('Unable to find user')
          }
          res.status(200).send(user)
      }).catch((error)=>{
          res.status(500).send(error)
      })

})

//update
// router.patch('/users/:id', async (req,res)=>{
//     try {
//         const updates = Object.keys(req.body);
//         const allowedUpdates = ["name","password"];
//         var isValid = updates.every((update)=> allowedUpdates.includes(update))

//         if(!isValid){
//             return res.status(400).send('can\'t update');
//         }

//         const _id = req.params.id;
//         const userData =req.body;
//         const user = await User.findByIdAndUpdate(_id,userData,{
//             new:true,
//             runValidators:true
//         })
//         if (!user){
//             return res.status(404).send('Unable to find');
//         }
//         res.status(200).send(user);
        
//     } catch (error) {
//         res.status(400).send('error '+error);
//     }
// } )

router.patch('/users/:id', auth,async (req,res)=>{
    try {
        const _id = req.params.id;
        const userData =req.body;
        const updates = Object.keys(userData);
        const allowedUpdates = ["name","password"];
        var isValid = updates.every((update)=> allowedUpdates.includes(update))

        if(!isValid){
            return res.status(400).send('can\'t update');
        }

        
        // const user = await User.findByIdAndUpdate(_id,userData,{
        //     new:true,
        //     runValidators:true
        // })
        const user = await User.findById(_id);

        if (!user){
            return res.status(404).send('Unable to find');
        }
        updates.forEach((update)=>user[update]=userData[update]);
        await user.save();  
        res.status(200).send(user);
        
    } catch (error) {
        res.status(400).send('error '+error);
    }
} )




//delete
router.delete('/users/:id',auth,async (req,res)=>{
    try {
        const _id = req.params.id;
        const user = await User.findByIdAndDelete(_id);
        if (!user){
            return res.status(404).send('Unable to find')
        }
        res.status(200).send(user)
        
    } catch (error) {
        res.status(500).send(error);
    }
})

//logout
router.delete('/logout',auth,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((ele)=>{
            return ele.token !== req.token;
        })
        await req.user.save();
        res.status(200).send('logout success');
    } catch (error) {
        res.status(500).send(error);
    }
})

//logoutAll
router.delete('/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save();
        res.status(200).send('logout all success');
    } catch (error) {
        res.status(500).send(error);
    }
})

//avatar
const uploads =multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/.*\.(gif|jpe?g|bmp|png)$/igm)){
            cb(new Error('not suitable file'))

        }
        cb(null, true)

    }
    
})
router.post('/profile/avatar',auth,uploads.single('avatar'),async(req, res)=>{
    try {
        req.user.avatar = req.file.buffer
        await req.user.save();
        res.status(200).send('File uploded')
    } catch (error) {
        res.status(500).send(error);

    }
    
})
module.exports = router;