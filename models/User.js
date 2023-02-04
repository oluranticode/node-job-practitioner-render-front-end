require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const Userschema = new mongoose.Schema({
    name:{
        type : String,
        required:[true, 'Please provide your name'],
        minlength: 3,
        maxlength: 50,
    },
    email:{
        type : String,
        required:[true, 'Please provide your email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
                'Please Provide a valid email'
        ],
        unique:true
    },
    password:{
        type : String,
        required:[true, 'Please provide your password'],
        minlength: 3,
    },

})

// ......Creating hash Password......
Userschema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Userschema.methods.getName = function () {
//     return this.name
// }

// ......Creating jwt token......
Userschema.methods.createJWT = function () {
    const {JWT_SECRET, JWT_LIFETIME} = process.env;
    return jwt.sign({userId:this._id, name:this.name}, JWT_SECRET, {expiresIn:JWT_LIFETIME})
}

// ........comparing user passowrd with hashpassword in db.......
Userschema.methods.comparePassword = async function (currentPassword) {
    const isMatch = await bcrypt.compare(currentPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', Userschema);  