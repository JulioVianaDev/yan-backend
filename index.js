const express = require('express')
const cors = require('cors')
require('dotenv').config()
const userRoutes = require("./routes/userRoutes")
const app = express()
app.use(cors())
app.use(express.json())
app.use('/users',userRoutes)
app.use('/uploads', express.static('uploads')); // Serve uploaded images

app.listen(8080,()=>{
  console.log("app rodando")
})
require("./database/connection")
