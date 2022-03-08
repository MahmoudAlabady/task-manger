const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs= require('bcryptjs');
const jwt = require('jsonwebtoken');
// const auth = require('../middelware/auth')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error()
            }
        }
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value<1){
                throw new Error()
            }
        }
    },
    password:{
        type:String,
        required:true,
        tirm:true,
        minLength:6
    },
    tokens:[
        
   { token:{
        type:String,
        required:true
    }
}
],
avatar:{
    type:Buffer,
}


})
//////////////////////////////////////////
//relation user=>_id , task=>owner
userSchema.virtual('tasks',{
    //relation wich collection (model)
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})



//////////////////

//hash password
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password =await bcryptjs.hash(user.password,8)

    }
    next()
})

//login-- statics for models
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error('please sign up');
    
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if(!isMatch){
        throw new Error('sorry this password is wrong');
    }
    return user
}
//jsonwebtoken-- methods for ver
userSchema.methods.generateToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user._id.toString()} ,process.env.JWT_SECRET)
    //console.log(token)

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}
const User = mongoose.model('User',userSchema)

module.exports = User;