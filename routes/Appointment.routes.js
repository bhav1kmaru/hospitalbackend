const express = require('express')
const { AppointModel } = require('../models/AppointmentModel')

const appointmentRouter=express.Router()

appointmentRouter.post('/add',async(req,res)=>{
    try {
        const {name,image,specialization,experience,location,slots,fee}=req.body
        const appointment = new AppointModel({
          name,
          image,
          specialization,
          experience,
          location,
          slots,
          fee,
          date: `${new Date()}`,
        });
        await appointment.save()
        res.send({message: 'Appointment saved successfully'})

    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

appointmentRouter.get('/',async(req,res)=>{
    try {
       const {page=1,limit=4,sort='-date',specialization,name}=req.query
       const filter={}

       if(specialization){
        filter.specialization=specialization
       }
       if(name){
        filter.name={$regex:new RegExp(name,'i')}
       }

       const appointments=await AppointModel.find(filter).sort(sort).skip((page-1)*limit).limit(limit).lean()
       const count=await AppointModel.countDocuments(filter)

       res.send({total_pages:Math.ceil(count/limit),page,appointments})

    } catch (error) {
        res.status(400).send(error.message)
    }
})

appointmentRouter.patch('/',async(req,res)=>{
    try {
        const {slots,id}=req.body
        await AppointModel.findByIdAndUpdate(id,{slots:slots-1})
        res.send('Booked')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = {appointmentRouter}