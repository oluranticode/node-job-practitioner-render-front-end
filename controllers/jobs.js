const Job = require('../models/Job')
const {BadRequestError, NotFoundError} = require('../errors');
const {StatusCodes} = require('http-status-codes');

const getAllJobs = async(req, res) => {
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getJob = async(req, res) => {
    const {user:{userId}, params:{id:jobId}} = req;
    const job = await Job.findOne({_id:jobId, createdBy:userId});
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job});
}

const createJob = async(req, res) => {
    const {company, position} = req.body;
    if(!company && !position) {
        throw new BadRequestError('Please provide all neccessary details');
    }
    req.body.createdBy = req.user.userId;
    // req.body.createdBy = req.user.name;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({Job: job});
}

const updateJob = async(req, res) => {
    const {body:{ company, position }, user:{userId}, params:{id:jobId}} = req;
    if(company === '' || position === ''){
        throw new BadRequestError('company or position cannot be empty');
    }
    const job = await Job.findByIdAndUpdate({_id:jobId, createdBy:userId}, req.body, {new:true, runValidators:true})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.CREATED).json({Job: job});
}

const deleteJob = async(req, res) => {
    const { user:{userId}, params: {id: jobId}, } = req;
         const job = await Job.findByIdAndRemove({
            _id:jobId, createdBy:userId
         })
         if(!job){
            throw new NotFoundError(`No job with id ${jobId}`)
         }
         res.status(StatusCodes.OK).send('job deleted!');
}

module.exports = {getAllJobs, getJob, createJob, updateJob, deleteJob}