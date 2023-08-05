const mongoose = require("mongoose")

const dbUrl = process.env.dbUrl
const connect = ()=>{
  mongoose.connect(dbUrl)
  const connection = mongoose.connection;
  
  connection.on("error",()=>{
    console.log("Erro ao conectar com o mongoDB")
  })
  
  connection.on("open",()=>{
    console.log("Conectado com o mongoDB")
  })
}
connect()