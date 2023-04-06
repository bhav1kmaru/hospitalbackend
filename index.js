const express = require('express')
const cors=require('cors')
const { connection } = require('./config/db')
const { userRouter } = require('./routes/User.routes')
const { appointmentRouter } = require('./routes/Appointment.routes')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{

    res.send('Welcome to Hospital Backend')

})

app.use('/users',userRouter)
app.use('/appointments',appointmentRouter)

const port=8080
app.listen(port,async()=>{
    console.log(`server running on port ${port}`)
    try {
        await connection
        console.log('connected to db')
    } catch (error) {
        console.log('could not connect to db')
    }
})