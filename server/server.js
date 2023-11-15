const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const UserModel= require('./models/Users')

const app=express()
app.use(cors()) //enable to use cors
app.use(express.json()) //allows to convert in json format files I transfer from frontend to server


mongoose.connect("mongodb://127.0.0.1:27017/Squealer", { useNewUrlParser: true, useUnifiedTopology: true });


//API per inviare al database i dati dell' utente in fase di registrazione 
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


//API per verificare ch ele credenziali inserite siano corrette in fase di login
app.post('/login', async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(req.body.username, req.body.password);
    if (user !== null) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: 'Credenziali non valide' }); // Cambiato lo status a 401 per indicare un errore di autenticazione
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il login' });
  }
});

// API per ottenere la lista degli utenti
app.get('/users', async (req, res) => {
  try {
      const users = await UserModel.find();
      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante il recupero degli utenti' });
  }
});









app.listen(3001, ()=>{
    console.log("Server is running")
})

