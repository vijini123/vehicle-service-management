import express from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";
import userRoute from './Routes/Users.js'
import authRoute from './Routes/Auth.js'
import reviewRoute from './Routes/Reviews.js'
import bookingRoute from './Routes/Bookings.js'
import vehicleRoute from './Routes/Vehicle.js'
import employeeRoute from './Routes/Employee.js'
import packageRoute from './Routes/Package.js'
import packageBookingRoute from './Routes/PackageBooking.js'
import emailRoutes from './Routes/EmailRoutes.js'
import OpenAI from 'openai';
import supplierRoute from './Routes/Supplier.js'
import inventoryRoute from "./Routes/Inventory.js";
import serviceHelpRequestRoutes from './Routes/ServiceHelpRequestRoutes.js';

dotenv.config()
const app = express()
const port = process.env.PORT || 8000
const corsOptions = {
    origin:true,
    credentials:true
}

mongoose.set("strictQuery", false)
const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        console.log('MongoDB Database Connected🌸🌿');
    } catch (err) {
        console.log('MongoDB Database Connection Failed');
    }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/review', reviewRoute)
app.use('/api/v1/booking', bookingRoute)
app.use('/api/v1/package', packageRoute)
app.use('/api/v1/packageBooking', packageBookingRoute)
app.use('/api/v1/vehicle', vehicleRoute)
app.use('/api/v1/employee', employeeRoute)
app.use('/api/v1/email', emailRoutes);
app.use('/api/v1/supplier', supplierRoute)
app.use('/api/v1/inventory', inventoryRoute)
app.use('/api/v1/service-help-requests', serviceHelpRequestRoutes);
app.post('/api/v1/tours')
app.get('/api/v1/teams')

app.post('/api/v1/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

app.listen(port , ()=>{
    connect();
    console.log('Server Running on PORT 🌍 ', port);
})


  
  
  
