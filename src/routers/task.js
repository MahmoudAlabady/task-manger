const express = require('express');

const router = new express.Router();

const Task = require('../models/task'); 
const auth = require('../middelware/auth')


//create  
router.post('/tasks',auth,async(req, res)=>{
    try {
    const owner = req.user._id;    
    const  taskData = req.body;
    const task = await new Task({...taskData,owner});
    await task.save();
    res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
} )
// read all
router.get('/tasks',auth,async(req, res)=>{
    try {
        const match ={}
        if (req.query.completed) {
            match.completed = req.query.completed==='true';
            
        }
        const sort = {};
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':');

            sort[parts[0]]=parts[1]==='desc'? -1 : 1;
        }
    // const task = await Task.find({});
    await req.user.populate({
        path:'tasks',
        match:match,
        options: {
            sort:sort,
        }
        
    });
    res.status(200).send(req.user.tasks);

    } catch (error) {
        res.status(400).send("e"+error);
    }
})
//read one by id
router.get('/tasks/:id',auth, async(req, res)=>{
    try {
        const _id = req.params.id;
        const owner = req.user._id;
        // console.log(req.params);
        const task = await Task.findOne({_id,owner});
        if (!task){
            return res.status(404).send('No task is found');
        }
        res.status(200).send(task);

    } catch (error) {
        res.status(500).send("e"+error);
 
    }
})

//update
router.patch('/tasks/:id',auth,async(req,res)=>{
    try {
        const taskData = req.body;
        const _id = req.params.id;
        const updates = Object.keys(taskData);
        
        const owner = req.user._id;
        const task = await Task.findOne({_id,owner});
        const allowedUpdates = ['completed'];
        
        var isValid = updates.every((update)=>allowedUpdates.includes(update));
        console.log(isValid)
        if (!isValid){
            res.status(400).send('can\'t update');
        }
       
        // const task = await Task.findByIdAndUpdate(_id,taskData,{
        //     new:true,
        //     runValidators:true,
        // });
        if (!task){
            return res.status(404).send('Unable to find the task');
        }
        updates.forEach((update)=>task[update]=taskData[update]);
        await task.save();
     res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);

    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    
    try {
        const owner = req.user._id;

    const _id = req.params.id;
    const task =await Task.findOneAndDelete({_id,owner});
    if (!task) {
        return res.status(404).send('Failed to find the task');
        
    }
    res.status(200).send(task);

    } catch (error) {
        res.status(500).send('e'+error);

    }
})

//delete
// router.delete('/users/:id',async (req,res)=>{
//     try {
//         const _id = req.params.id;
//         const user = await User.findByIdAndDelete(_id);
//         if (!user){
//             return res.status(404).send('Unable to find')
//         }
//         res.status(200).send(user)
        
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })

router.get('/userTask/:id',auth,async(req,res)=>{
    try {
        const _id = req.params.id;
        const task = await Task.findOne({_id,owner:req.user._id});
        if(!task){
            return res.status(404).send('no task is found');
        }
        await task.populate('owner');
        res.status(200).send(task.owner);
    } catch (error) {
        
    }
})


module.exports = router;