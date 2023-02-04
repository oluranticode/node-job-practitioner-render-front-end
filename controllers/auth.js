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

    // ........Hash Password.............
//    const {name, email, password} = req.body;
//    const salt = await bcrypt.genSalt(10);
//    const hashPassword = await bcrypt.hash(password, salt);
//    const tempUser = {name, email, password:hashPassword}
//    const user = await User.create({...tempUser});

//.......Generate TOKEN............
// const user = await User.create({...req.body});
// const token = jwt.sign({userId:user._id, name:user.name}, "jwtSecret", {expiresIn: '30d'})

    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{name:user.name}, token:{token:token}})
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
        res.status(StatusCodes.OK).json({user : {name:user.name}, token})
    
}

module.exports = {register, login}