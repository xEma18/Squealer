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


//API per modificare i campi (tipo account, popolarità, caratteri...) di uno specifico utente (di cui ho nome e cognome)
app.post('/editUser', async (req, res)=>{
  try{
    const user = await UserModel.findByNameAndLastname(req.body.nome, req.body.cognome);

        if (user !== null) {
            // Aggiorna i campi dell'utente con i nuovi valori
            user.tipoUtente = req.body.tipoUtente;
            user.popolarità = req.body.popolarita;
            user.caratteriGiornalieri = req.body.caratteriGiornalieri;
            user.caratteriSettimanali = req.body.caratteriSettimanali;
            user.caratteriMensili = req.body.caratteriMensili;

            // Salva le modifiche nel database
            await user.save();

            // Invia una risposta di successo
            res.status(200).json({ message: 'Dati utente aggiornati con successo nel database' });
        } else {
            // Invia una risposta con errore se l'utente non è stato trovato
            res.status(404).json({ message: 'Utente non trovato nel database' });
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'utente nel database:', error);
        // Invia una risposta con errore generico
        res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'utente nel database' });
    }
});









app.listen(3001, ()=>{
    console.log("Server is running")
})
