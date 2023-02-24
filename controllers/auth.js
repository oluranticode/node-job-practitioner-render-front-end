const User = require('../models/User')
const {StatusCodes} = require('http-status-codes');
const {BadRequestError} = require('../errors');
const {UnauthenticatedError} = require('../errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = async(req, res) => {

    // validation...
    const {name, email, password} = req.body;
    if(!name || !email || !password){
       throw new BadRequestError('Please provide all neccessary details');
    }

    const user = await User.create({...req.body});
    const token = user.createJWT();
    // res.status(StatusCodes.CREATED).json({user:{name:user.name}, token:{token:token}})
    res.status(StatusCodes.CREATED).json({user:{
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
        token,
      },
    })
}

const login = async(req, res) => {
    const {email, password} = req.body;
        if(!email || !password){
            throw new BadRequestError('Please provide email and password');
        }
        const user = await User.findOne({email});
        // check if email exist..........
        if(!user){
            throw new UnauthenticatedError('email does not exist!');
        }
        // .....comparing password......
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            throw new UnauthenticatedError('Password does not match!');
        }
        const token = user.createJWT();
        // res.status(StatusCodes.OK).json({user : {name:user.name}, token})
        res.status(StatusCodes.CREATED).json({user:{
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
          },
        })
    
}

module.exports = {register, login}