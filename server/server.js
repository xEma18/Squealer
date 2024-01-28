const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const UserModel= require('./models/Users')
const SquealModel= require('./models/Squeals')
const ChannelModel= require('./models/Channels')
const CounterModel= require('./models/Counters')
const app=express()

app.use(cors()) //enable to use cors
 //allows to convert in json format files I transfer from frontend to server
app.use(express.json({ limit: '20mb' })); // Imposta il limite a 10 MB
app.use(express.urlencoded({ extended: true, limit: '20mb' })); // Imposta il limite a 10 MB



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

//API per controllare che non ci si registri con username o email già presenti nel database
app.post('/checkIfUserAndEmailAlreadyRegistered', async (req, res) => {
  const { email, username } = req.body;
  
  const userExists = await UserModel.findOne({ $or: [{ email }, { username }] });
  
  if (userExists) {
      return res.status(200).json({ exists: true });
  } else {
      return res.status(200).json({ exists: false });
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

app.get('/generateGuestNumber', async (req, res) => {
  try {
    const counterName = 'guestCounter';
    const counter = await CounterModel.findOne({ name: counterName });

    if (counter) {
      currentValue = counter.count;
      // Se il contatore esiste, lo incremento
      counter.count += 1;
      await counter.save();
      res.status(200).json({ guestNumber: currentValue });
      } else {
      // Il contatore esiste per forza, ma per sicurezza gestisco anche il caso in cui non esista
      res.status(404).json({ error: 'Contatore non trovato' });
      }
      } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore interno del server' });
      }
      });


// API per ottenere la lista degli squeal
app.get('/squeals', async (req, res) => {
  try {
      const squeals = await SquealModel.find();
      res.status(200).json(squeals);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante il recupero degli squeal' });
  }
});

//API per ottenere gli Squeals che hanno come destinatario un utente specifico + tutti gli squeal "pubblici" (@everyone) se username !="guest"
app.post('/squealsToUser', async (req, res) => {
  try {
      const squeals = await SquealModel.findSquealsToUser(req.body.username);
      res.status(200).json(squeals);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante il recupero degli squeals all\'utente' });
  }
});

app.post('/getUserImageAndCharLeft', async (req, res) => {
  try {
    const username = req.body.username;
    const user = await UserModel.findOne({ username: username }).select('image caratteriGiornalieri caratteriSettimanali caratteriMensili caratteriGiornalieriUsati caratteriMensiliUsati caratteriSettimanaliUsati');
    

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Utente non trovato' });
    }
    } catch (error) {
    console.error('Errore durante la ricerca dell utente:', error);
    res.status(500).json({ message: 'Errore interno del server' });
    }
    });


app.post('/addEmoticonGood', async (req, res)=>{
  try{
    const squeal = await SquealModel.findById(req.body._id);
    if (!squeal) {
      return res.status(404).json({ error: 'Squeal non trovato' });
    }
    squeal.emoticonNum.good += 1;
    squeal.emoticonGivenBy.good.push(req.body.username);

    if(squeal.category!=='private'){
      if(squeal.emoticonNum.good > 0.25*squeal.impression && squeal.emoticonNum.bad > 0.25*squeal.impression){
        squeal.category="Controversial"
      }
      else if(squeal.emoticonNum.good > 0.25*squeal.impression){
        squeal.category="Popular"
      }
    }
    

    await squeal.save();
    res.status(200).json(squeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});


app.post('/removeEmoticonGood', async (req, res)=>{
  try{
    const squeal = await SquealModel.findById(req.body._id);
    if (!squeal) {
      return res.status(404).json({ error: 'Squeal non trovato' });
    }
    squeal.emoticonNum.good -= 1;
    squeal.emoticonGivenBy.good.pop(req.body.username);

    if(squeal.category !== 'private'){
      if(squeal.emoticonNum.good > 0.25*squeal.impression && squeal.emoticonNum.bad > 0.25*squeal.impression){
        squeal.category="Controversial"
      }
      else if(squeal.emoticonNum.bad > 0.25*squeal.impression){
        squeal.category="Unpopular"
      }
    }
    
    await squeal.save();
    res.status(200).json(squeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
})

app.post('/addEmoticonBad', async (req, res)=>{
  try{
    const squeal = await SquealModel.findById(req.body._id);
    if (!squeal) {
      return res.status(404).json({ error: 'Squeal non trovato' });
    }
    squeal.emoticonNum.bad += 1;
    squeal.emoticonGivenBy.bad.push(req.body.username);
    await squeal.save();
    res.status(200).json(squeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
})

app.post('/removeEmoticonBad', async (req, res)=>{
  try{
    const squeal = await SquealModel.findById(req.body._id);
    if (!squeal) {
      return res.status(404).json({ error: 'Squeal non trovato' });
    }
    squeal.emoticonNum.bad -= 1;
    squeal.emoticonGivenBy.bad.pop(req.body.username);
    await squeal.save();
    res.status(200).json(squeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.post('/addImpression', async (req, res) => {
  try {
      const { _id, username } = req.body;
      const squeal = await SquealModel.findById(_id);
      if (!squeal) {
          return res.status(404).json({ error: 'Squeal non trovato' });
      }
      if (!squeal.impressionGivenBy.includes(username)) {
          squeal.impressionGivenBy.push(username)
          squeal.impression += 1;
          await squeal.save();
      }
      res.status(200).json(squeal);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.post('/postSqueal', async (req, res) => {
  try {
      const newSqueal = new SquealModel(req.body);
      await newSqueal.save();
      res.status(201).json(newSqueal);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'invio dello squeal' });
  }
});

app.post('/updateCharsLeft', async (req, res) => {
  try{
    //find by username
      const user=await UserModel.findByUsername(req.body.username);
      if(user !== null){
        user.caratteriGiornalieriUsati = req.body.caratteriGiornalieriUsati;
        user.caratteriSettimanaliUsati = req.body.caratteriSettimanaliUsati;
        user.caratteriMensiliUsati = req.body.caratteriMensiliUsati;
        await user.save();
        res.status(200).json({ message: 'Dati utente aggiornati con successo nel database' });
      }
      }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento dei caratteri rimanenti' });
  }
});


//API per modificare i campi (tipo account, popolarità, caratteri...) di uno specifico utente (di cui ho nome e cognome)
app.post('/editUser', async (req, res)=>{
  try{
    const user = await UserModel.findByNameAndLastname(req.body.nome, req.body.cognome);
        if (user !== null) {
            // Aggiorna i campi dell'utente con i nuovi valori
            user.tipoUtente = req.body.tipoUtente;
            user.popolarita = req.body.popolarita;
            user.caratteriGiornalieri = req.body.caratteriGiornalieri;
            user.caratteriSettimanali = req.body.caratteriSettimanali;
            user.caratteriMensili = req.body.caratteriMensili;
            user.status = req.body.status;   
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

// API per aggiungere un nuovo squeal
app.post('/newSqueal', async (req, res) => {
  try {
      const newSqueal = new SquealModel(req.body);
      console.log("Squeal da aggiungere:")
      console.log(newSqueal)
      await newSqueal.save();
      res.status(201).json(newSqueal);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'aggiunta dello squeal' });
  }
});

// Api per rimuovere uno specifico squeal
app.post('/removeSqueal', async (req, res) => {
  console.log("removeSqueal")
  try {
      console.log("entrato nel try")
      const squealId = req.body._id;
      console.log(req.body)
      console.log("id dello squeal da eliminare",squealId)
      const deletedSqueal = await SquealModel.findByIdAndDelete(squealId);
      console.log("squeal eliminato",squealId)

      if (deletedSqueal) {
          res.status(200).json({ message: 'Squeal rimosso con successo' });
      } else {
          res.status(404).json({ error: 'Squeal non trovato' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante la rimozione dello squeal' });
  }
});


//API per aggiungere i destinatari di uno specifico squeal (di cui ho username del mittente)
app.post('/addRecv', async (req, res)=>{
  console.log("body: "+req.body.mittente);
  try{
    //Cerco lo squeal da modificare
    const squeal = await SquealModel.findSquealByUsername(req.body.mittente);
        if (squeal !== null) {
            // Aggiorna il campo destinatari con i nuovi utenti aggiunti
            squeal.destinatari = squeal.destinatari.concat(req.body.destinatari);
            console.log("destinatari aggiornati: "+squeal.destinatari);
            // Salva le modifiche nel database
            await squeal.save();
            // Invia una risposta di successo
            res.status(200).json({ message: 'Modifiche allo Squeal apportate con successo nel database' });
        } else {
            // Invia una risposta con errore se l'utente non è stato trovato
            res.status(404).json({ message: 'Squeal non trovato nel database' });
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dello squeal nel database:', error);
        // Invia una risposta con errore generico
        res.status(500).json({ message: 'Errore durante l\'aggiornamento dello squeal nel database' });
    }
});

//API per rimuovere i destinatari di uno specifico squeal (di cui ho username del mittente)
app.post('/remRecv', async (req, res)=>{
  console.log("body")
  console.log(req.body);
  try{
    //Cerco lo squeal da modificare
    const squeal = await SquealModel.findSquealByUsername(req.body.mittente);
        if (squeal !== null) {
          console.log(typeof squeal.destinatari);
            // Aggiorna il campo destinatari con i nuovi utenti aggiunti
            squeal.destinatari = squeal.destinatari.map(nome => nome.trim()).filter(nome => !req.body.destinatari.includes(nome));
            console.log("destinatari aggiornati: " + squeal.destinatari);
            // Salva le modifiche nel database
            await squeal.save();
            // Invia una risposta di successo
            res.status(200).json({ message: 'Modifiche allo Squeal apportate con successo nel database' });
        } else {
            // Invia una risposta con errore se l'utente non è stato trovato
            res.status(404).json({ message: 'Squeal non trovato nel database' });
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dello squeal nel database:', error);
        // Invia una risposta con errore generico
        res.status(500).json({ message: 'Errore durante l\'aggiornamento dello squeal nel database' });
    }
});

// API per ottenere la lista di tutti i canali
app.get('/channels', async (req, res) => {
  try {
      const channels = await ChannelModel.find();
      res.status(200).json(channels);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante il recupero dei canali' });
  }
});


// API per modificare la descrizione di un canale
app.post('/editChannelDescription', async (req, res)=>{
  try{
    const channel = await ChannelModel.findChannelByName(req.body.name);
        if (channel !== null) {
            // Aggiorna i campi dell'utente con i nuovi valori
            channel.description = req.body.description;
            // Salva le modifiche nel database
            await channel.save();
            // Invia una risposta di successo
            res.status(200).json({ message: 'Dati utente aggiornati con successo nel database' });
        } else {
            // Invia una risposta con errore se l'utente non è stato trovato
            res.status(404).json({ message: 'Canale non trovato nel database' });
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del canale nel database:', error);
        // Invia una risposta con errore generico
        res.status(500).json({ message: 'Errore durante l\'aggiornamento del canale nel database' });
    }
});

    // API per aggiungere uno squeal dalla lista squeal canale
    app.post('/editChannelSqueal', async (req, res) => {
  try {
      console.log("editChannelSqueal")
      console.log("Entro nella modifica numero squeal del canale");
      const channel = await ChannelModel.findChannelByName(req.body.name);
      if(channel !== null) {
        // Aggiorna l'elenco degli squeal del canale con il nuovo ID dello squeal
        if (req.body.newSquealId) {
          console.log("squeal che si sta aggiungendo all'array");
          console.log(req.body.newSquealId);
        channel.listofSqueals.push(req.body.newSquealId);
        }
        await channel.save();
        res.status(200).json({ message: 'Canale aggiornato con successo nel database' });
        } else {
        res.status(404).json({ message: 'Canale non trovato nel database' });
        }
        } catch (error) {
        console.error('Errore durante aggiornamento del canale nel database:', error);
        res.status(500).json({ message: 'Errore durante aggiornamento del canale nel database' });
        }
    });

    // API per rimuovere uno squeal dalla lista squeal canale
    app.post('/removeSquealFromChannel', async (req, res) => {
      try {
        console.log("removeSquealFromChannel");
        const { channelName, squealId } = req.body;
        
        // Trova il canale specifico
        const channel = await ChannelModel.findOne({ name: channelName });
        if (!channel) {
          return res.status(404).json({ message: 'Canale non trovato' });
        }
    
        // Rimuovi l'ID dello squeal dalla lista di squeal del canale
        channel.listofSqueals = channel.listofSqueals.filter(id => id.toString() !== squealId);
        await channel.save();
    
        res.status(200).json({ message: 'Squeal rimosso dal canale con successo' });
      } catch (error) {
        console.error('Errore durante la rimozione dello squeal dal canale:', error);
        res.status(500).json({ message: 'Errore interno del server' });
      }
    });
    
    // Api per ritornare gli squeal di uno specifico canale
    app.get('/squealsByChannel', async (req, res) => {
      try {
          console.log("squealsByChannel")
          console.log(req.query)
          const channelId = req.query.channelId;
          console.log(channelId);
          const channel = await ChannelModel.findById(channelId);
          console.log(channel);
          if (!channel) {
              return res.status(404).send('Canale non trovato');
          }
          const squeals = await SquealModel.find({ '_id': { $in: channel.listofSqueals } });
          console.log(squeals);
          res.json(squeals);
      } catch (error) {
          res.status(500).send('Errore interno del server');
      }
    });

    // Api per aggiungere un canale
    app.post('/addChannel', async (req, res) => {
      try {
        const newChannel = new ChannelModel({
          name: req.body.name,
          type: req.body.type,
          description: req.body.description,
        });
        await newChannel.save();
        res.status(201).json(newChannel);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore durante la creazione del canale' });
      }
    });

    //Api per rimuovere un canale
    app.post('/removeChannel', async (req, res) => {
      try {
          const channelName = req.body.name;
          // Utilizza il modello di Mongoose per trovare e rimuovere il canale per nome
          const deletedChannel = await ChannelModel.findOneAndDelete({ name: channelName });
  
          if (deletedChannel) {
              res.status(200).json({ message: 'Canale rimosso con successo' });
          } else {
              res.status(404).json({ error: 'Canale non trovato' });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Errore durante la rimozione del canale' });
      }
  });
  

  //APi che dà profile pic from username
  app.post('/profilePicByUsername', async (req, res) => {
    try {
        const user = await UserModel.findByUsername(req.body.username);
        if (!user) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }
        res.status(200).json({ image: user.image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
  });


  app.post('/search', async (req, res) => {
    try {
        const searchTerm = req.body.searchTerm;
        let users = [], channels = [], keywordCounts = {}; 
        const loggedUser = req.body.username;

        if (searchTerm.startsWith('@')) {
            // Ricerca per utenti
            users = await UserModel.find({ username: new RegExp(searchTerm, 'i') }); // i = case insensitive (maiuscole/minuscole non fanno differenza)
        
          } else if (searchTerm.startsWith('§')) {
            // Ricerca per canali
            channels = await ChannelModel.find({ name: new RegExp(searchTerm, 'i') });

          } else if (searchTerm.startsWith('#')) {
              const regex = new RegExp(searchTerm.slice(1), 'i'); // Rimuove '#' e prepara la regex
              const squeals = await SquealModel.find({ 
                text: regex,
                $or: [{ destinatari: loggedUser }, { destinatari: '@everyone' }]
              });
              squeals.forEach(squeal => {
              const words = squeal.text.match(/#\w+/g); // Trova tutte le parole che iniziano con '#'
                if (words) {
                    words.forEach(word => {
                        if (regex.test(word)) { // Aggiungi solo se corrisponde al termine di ricerca specifico
                            keywordCounts[word]= (keywordCounts[word] || 0) + 1;
                        }
                    });
                }
            });
        }

         // Converti l'oggetto keywordCounts in un array di oggetti (per poterlo scorrere nel frontend)
         let keywordsArray = Object.keys(keywordCounts).map(key => {
          return { keyword: key, count: keywordCounts[key] };
      });

        res.json({ users, channels, keywords:keywordsArray});
    } catch (error) {
        console.error('Errore durante la ricerca:', error);
        res.status(500).send('Si è verificato un errore durante la ricerca');
    }
});

//Api per ottenere, dato username, tutti i dati dell'utente (username è come query) const response = await axios.get(`http://localhost:3001/getUserByUsername/${username}`);
app.get('/getUserByUsername/:username', async (req, res) => {
  try {
      const username = req.params.username;
      console.log('parametro username:', username)
      const user = await UserModel.findByUsername(username);
      
      if (!user) {
          return res.status(404).json({ error: 'Utente non trovato' });
      }
      res.status(200).json(user);
      console.log(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore interno del server' });
  }
});

//Api per ottenere squeal con mittente uno username dato come query
app.get('/getSquealsBySender/:username', async (req, res) => {
  try {
      const username = req.params.username;
      const squeals = await SquealModel.findSquealsByUsername(username);
      res.status(200).json(squeals);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore interno del server' });
  }
});

//api per ottenere numero di squeal pubblicati da un utente, somma totale numero di likes e dislikes dei suoi post
app.get('/getUserActivity/:username', async (req, res) => {
  try {
      const username = req.params.username;
      const squeals = await SquealModel.findSquealsByUsername(username);
      let likes = 0;
      let dislikes = 0;
      squeals.forEach(squeal => {
        likes += squeal.emoticonNum.good;
        dislikes += squeal.emoticonNum.bad;
      });
      res.status(200).json({ squeals: squeals.length, likes, dislikes });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.listen(3001, ()=>{
    console.log("Server is running")
})

