const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const UserModel= require('./models/Users')

const app=express()
app.use(cors()) //enable to use cors
app.use(express.json()) //allows to convert in json format files I transfer from frontend to server


mongoose.connect("mongodb://127.0.0.1:27017/Squealer", { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/signup', async (req, res) => {
    try {
      
      const newUser = new UserModel(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante la registrazione' });
    }
});

app.listen(3001, ()=>{
    console.log("Server is running")
})

