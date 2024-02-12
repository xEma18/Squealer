const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const UserModel = require('./models/Users');
const SquealModel = require('./models/Squeals');
const ChannelModel = require('./models/Channels');
const CounterModel = require('./models/Counters');
const fetch = require('node-fetch');
const path = require("path")

const app = express();

app.use(
  "/SMM",
  //checkRole(["SMM", "Mod"]),
  express.static(path.join(__dirname,"..", "SMM","smm", "dist"))
);

app.get("/SMM/*", async function (req, res) {
  res.sendFile(
      path.join(
          __dirname,
          "..",
          "SMM",
          "smm",
          "dist",
          "index.html"
      )
  );
});

app.use(
  "/App",
  //checkRole(["SMM", "Mod"]),
  express.static(path.join(__dirname,"..", "App", "dist"))
);

app.get("/App/*", async function (req, res) {
  res.sendFile(
      path.join(
          __dirname,
          "..",
          "App",
          "dist",
          "index.html"
      )
  );
});

app.use(
  "/Moderator_Dashboard",
  //checkRole(["SMM", "Mod"]),
  express.static(path.join(__dirname,"..", "Moderator_Dashboard"))
);

app.get("/Moderator_Dashboard/*", async function (req, res) {
  res.sendFile(
      path.join(
          __dirname,
          "..",
          "Moderator_Dashboard",
          "HomePage.html"
      )
  );
});


const uri =
  "mongodb+srv://emanuele:emanuele@cluster0.dbp6yx6.mongodb.net/?retryWrites=true&w=majority";

app.use(cors()); //enable to use cors
//allows to convert in json format files I transfer from frontend to server
app.use(express.json({ limit: "20mb" })); // Imposta il limite a 10 MB
app.use(express.urlencoded({ extended: true, limit: "20mb" })); // Imposta il limite a 10 MB

mongoose.connect("mongodb://127.0.0.1:27017/Squealer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Funzioni di azzeramento
async function resetDailyCounters() {
  await UserModel.updateMany({}, { caratteriGiornalieriUsati: 0 });
  console.log("Caratteri giornalieri azzerati per tutti gli utenti.");
}

async function resetWeeklyCounters() {
  await UserModel.updateMany({}, { caratteriSettimanaliUsati: 0 });
  console.log("Caratteri settimanali azzerati per tutti gli utenti.");
}

async function resetMonthlyCounters() {
  await UserModel.updateMany({}, { caratteriMensiliUsati: 0 });
  console.log("Caratteri mensili azzerati per tutti gli utenti.");
}

// Pianificazione dell'azzeramento
cron.schedule("0 0 * * *", resetDailyCounters); // Esegue ogni giorno a mezzanotte
cron.schedule("0 0 * * 1", resetWeeklyCounters); // Esegue ogni lunedì a mezzanotte
cron.schedule("0 0 1 * *", resetMonthlyCounters); // Esegue il primo giorno di ogni mese a mezzanotte

//funzione per aggiornare popolarità utenti
async function updatePopularity() {
  try {
      // Aggiorna la popolarità degli utenti
      const users = await UserModel.find(); // Ottieni tutti gli utenti
      for (const user of users) {
          const squeals = await SquealModel.find({ mittente: user.username }); // Trova i post di ogni utente
          let totalLikes = 0;
          let totalImpressions = 0;
          squeals.forEach(squeal => {
              totalLikes += squeal.emoticonNum.good; // Assumo che "good" rappresenti i "likes"
              totalImpressions += squeal.impression;
          });
          const popularity = totalLikes > 0.25 * totalImpressions ? "High" : "Low";
          user.popolarita = popularity;
          await user.save();
      }
      console.log("Popolarità degli utenti aggiornata.");
  } catch (error) {
      console.error("Errore durante l'aggiornamento della popolarità:", error);
  }
}

// Pianificazione dell'aggiornamento della popolarità
cron.schedule("0 0 * * *", async () => {
  await updatePopularity();
});

async function updateCharacterQuotas() {
  const users = await UserModel.find(); 
  
  for (let user of users) {
      const squeals = await SquealModel.find({ mittente: user.username });
      let popularCount = 0;
      let unpopularCount = 0;

      squeals.forEach(squeal => {
          const isPopular = squeal.emoticonNum.good > squeal.impression * 0.25;
          const isUnpopular = squeal.emoticonNum.bad > squeal.impression * 0.25;

          if (isPopular && !isUnpopular) popularCount++;
          else if (isUnpopular && !isPopular) unpopularCount++;
      });

      const standardDailyQuota=500;
      const standardWeeklyQuota=standardDailyQuota*7;
      const standardMonthlyQuota=standardWeeklyQuota*4;
      const initialDailyQuota = user.caratteriGiornalieri;
      const initialWeeklyQuota = user.caratteriSettimanali;
      const initialMonthlyQuota = user.caratteriMensili;
      const increasePercent = Math.floor(popularCount / 10) * 0.01;
      const decreasePercent = Math.floor(unpopularCount / 3) * 0.01;

      user.caratteriGiornalieri = Math.round(Math.max(standardDailyQuota + standardDailyQuota * (increasePercent - decreasePercent), 0));
      user.caratteriSettimanali = Math.round(Math.max(standardWeeklyQuota + standardWeeklyQuota * (increasePercent - decreasePercent), 0));
      user.caratteriMensili = Math.round(Math.max(standardMonthlyQuota + standardMonthlyQuota * (increasePercent - decreasePercent), 0));

      await user.save();
  }
}

cron.schedule("0 0 * * *", async () => {
  await updateCharacterQuotas();
  console.log("Quote caratteri aggiornate per tutti gli utenti.");
});

//API per inviare al database i dati dell' utente in fase di registrazione
app.post("/signup", async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la registrazione" });
  }
});

//API per verificare ch ele credenziali inserite siano corrette in fase di login
app.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(
      req.body.username,
      req.body.password
    );
    if (user !== null) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: "Credenziali non valide" }); // Cambiato lo status a 401 per indicare un errore di autenticazione
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il login" });
  }
});

//API per controllare che non ci si registri con username o email già presenti nel database
app.post("/checkIfUserAndEmailAlreadyRegistered", async (req, res) => {
  const { email, username } = req.body;

  const userExists = await UserModel.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    return res.status(200).json({ exists: true });
  } else {
    return res.status(200).json({ exists: false });
  }
});

app.post('/checkIfChannelNameIsAlreadyTaken', async (req, res) => {
  const { name } = req.body;

  try {
      const channel = await ChannelModel.findChannelByName(name);
      if (channel) {
          res.json(true);
      } else {
          res.json(false);
      }
  } catch (error) {
      console.error('Errore durante la verifica del nome del canale:', error);
      res.status(500).json({ message: 'Errore interno del server' });
  }
});

// API per ottenere la lista degli utenti
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero degli utenti" });
  }
});

app.get("/generateGuestNumber", async (req, res) => {
  try {
    const counterName = "guestCounter";
    const counter = await CounterModel.findOne({ name: counterName });

    if (counter) {
      currentValue = counter.count;
      // Se il contatore esiste, lo incremento
      counter.count += 1;
      await counter.save();
      res.status(200).json({ guestNumber: currentValue });
    } else {
      // Il contatore esiste per forza, ma per sicurezza gestisco anche il caso in cui non esista
      res.status(404).json({ error: "Contatore non trovato" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// API per ottenere la lista degli squeal
app.get("/squeals", async (req, res) => {
  try {
    const squeals = await SquealModel.find();
    res.status(200).json(squeals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero degli squeal" });
  }
});

//API per ottenere gli Squeals che hanno come destinatario un utente specifico + tutti gli squeal "pubblici" (@everyone) se username !="guest"
app.post("/squealsToUser", async (req, res) => {
  try {
    const squeals = await SquealModel.findSquealsToUser(req.body.username);
    res.status(200).json(squeals);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore durante il recupero degli squeals all'utente" });
  }
});

app.post("/getUserImageAndCharLeft", async (req, res) => {
  try {
    const username = req.body.username;
    const user = await UserModel.findOne({ username: username }).select(
      "image caratteriGiornalieri caratteriSettimanali caratteriMensili caratteriGiornalieriUsati caratteriMensiliUsati caratteriSettimanaliUsati"
    );

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Utente non trovato" });
    }
  } catch (error) {
    console.error("Errore durante la ricerca dell utente:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// API per prendere i commenti di uno squeal
app.get('/squealComments/:squealId', async (req, res) => {
  const { squealId } = req.params;
  try {
    const squeal = await SquealModel.findById(squealId);
    if (!squeal) {
      return res.status(404).json({ message: 'Squeal non trovato.' });
    }
    res.status(200).json(squeal.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore interno del server.' });
  }
});

app.post("/squealComments", async (req, res) => {
    console.log(req.body);
  try{
    const squeal = await SquealModel.findById(req.body.squealId);
    if (!squeal) {
      return res.status(404).json({ error: "Squeal non trovato" });
    }

    squeal.comments = [...squeal.comments, req.body.comment];
    squeal.commentsNum += 1;

    await squeal.save();
    res.status(200).json(squeal);
  }catch(error){
    console.error(error);
    res.status(500).json({error: "Errore durante la pubblicazione del commento"})
  }
})

app.post("/addEmoticonGood", async (req, res) => {
  try {
    const squeal = await SquealModel.findById(req.body._id);
    if (!squeal) {
      return res.status(404).json({ error: "Squeal non trovato" });
    }
    squeal.emoticonNum.good += 1;
    squeal.emoticonGivenBy.good.push(req.body.username);

    if (squeal.category !== "Private") {
      if (
        squeal.emoticonNum.good > 0.25 * squeal.impression &&
        squeal.emoticonNum.bad > 0.25 * squeal.impression
      ) {
        squeal.category = "Controversial";
      } else if (squeal.emoticonNum.good > 0.25 * squeal.impression) {
        squeal.category = "Popular";
      }
      else if (squeal.emoticonNum.bad > 0.25 * squeal.impression) {
        squeal.category = "Unpopular";
      }
    }

    await squeal.save();
    res.status(200).json(squeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.post("/removeEmoticonGood", async (req, res) => {
  try {
    const squeal = await SquealModel.findById(req.body._id);
    if (!squeal) {
      return res.status(404).json({ error: "Squeal non trovato" });
    }
    squeal.emoticonNum.good -= 1;
    squeal.emoticonGivenBy.good.pop(req.body.username);

    if (squeal.category !== "Private") {
      if (
        squeal.emoticonNum.good > 0.25 * squeal.impression &&
        squeal.emoticonNum.bad > 0.25 * squeal.impression
      ) {
        squeal.category = "Controversial";
      } else if (squeal.emoticonNum.bad > 0.25 * squeal.impression) {
        squeal.category = "Unpopular";
      }
      else if (squeal.emoticonNum.bad > 0.25 * squeal.impression) {
        squeal.category = "Unpopular";
      }
    }

    await squeal.save();
    res.status(200).json(squeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.post("/addEmoticonBad", async (req, res) => {
  try {
    const squeal = await SquealModel.findById(req.body._id);
    if (!squeal) {
      return res.status(404).json({ error: "Squeal non trovato" });
    }
    squeal.emoticonNum.bad += 1;
    squeal.emoticonGivenBy.bad.push(req.body.username);

    if (squeal.category !== "Private") {
      if (
        squeal.emoticonNum.good > 0.25 * squeal.impression &&
        squeal.emoticonNum.bad > 0.25 * squeal.impression
      ) {
        squeal.category = "Controversial";
      } else if (squeal.emoticonNum.bad > 0.25 * squeal.impression) {
        squeal.category = "Unpopular";
      }
      else if (squeal.emoticonNum.bad > 0.25 * squeal.impression) {
        squeal.category = "Unpopular";
      }
    }

    await squeal.save();
    res.status(200).json(squeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.post("/removeEmoticonBad", async (req, res) => {
  try {
    const squeal = await SquealModel.findById(req.body._id);
    if (!squeal) {
      return res.status(404).json({ error: "Squeal non trovato" });
    }
    squeal.emoticonNum.bad -= 1;
    squeal.emoticonGivenBy.bad.pop(req.body.username);

    if (squeal.category !== "Private") {
      if (
        squeal.emoticonNum.good > 0.25 * squeal.impression &&
        squeal.emoticonNum.bad > 0.25 * squeal.impression
      ) {
        squeal.category = "Controversial";
      } else if (squeal.emoticonNum.bad > 0.25 * squeal.impression) {
        squeal.category = "Unpopular";
      }
      else if (squeal.emoticonNum.bad > 0.25 * squeal.impression) {
        squeal.category = "Unpopular";
      }
    }

    await squeal.save();
    res.status(200).json(squeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.post("/addImpression", async (req, res) => {
  try {
    const { _id, username } = req.body;
    const squeal = await SquealModel.findById(_id);
    if (!squeal) {
      return res.status(404).json({ error: "Squeal non trovato" });
    }
    if (!squeal.impressionGivenBy.includes(username)) {
      squeal.impressionGivenBy.push(username);
      squeal.impression += 1;
      await squeal.save();
    }
    res.status(200).json(squeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.post("/postSqueal", async (req, res) => {
  try {
    const newSqueal = new SquealModel(req.body);
    await newSqueal.save();
    res.status(201).json(newSqueal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante l'invio dello squeal" });
  }
});

app.post("/updateCharsLeft", async (req, res) => {
  try {
    //find by username
    const user = await UserModel.findByUsername(req.body.username);
    if (user !== null) {
      user.caratteriGiornalieriUsati = req.body.caratteriGiornalieriUsati;
      user.caratteriSettimanaliUsati = req.body.caratteriSettimanaliUsati;
      user.caratteriMensiliUsati = req.body.caratteriMensiliUsati;
      await user.save();
      res
        .status(200)
        .json({ message: "Dati utente aggiornati con successo nel database" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore nell'aggiornamento dei caratteri rimanenti" });
  }
});

//API per modificare i campi (tipo account, popolarità, caratteri...) di uno specifico utente (di cui ho nome e cognome)
app.post("/editUser", async (req, res) => {
  try {
    const user = await UserModel.findByNameAndLastname( //TODO
      req.body.nome,
      req.body.cognome
    );
    if (user !== null) {
      // Aggiorna i campi dell'utente con i nuovi valori
      user.tipoUtente = req.body.tipoUtente;
      user.popolarita = req.body.popolarita;
      user.caratteriGiornalieriUsati = req.body.caratteriGiornalieri;
      user.caratteriSettimanaliUsati = req.body.caratteriSettimanali;
      user.caratteriMensiliUsati = req.body.caratteriMensili;
      user.status = req.body.status;
      // Salva le modifiche nel database
      await user.save();
      // Invia una risposta di successo
      res
        .status(200)
        .json({ message: "Dati utente aggiornati con successo nel database" });
    } else {
      // Invia una risposta con errore se l'utente non è stato trovato
      res.status(404).json({ message: "Utente non trovato nel database" });
    }
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento dell'utente nel database:",
      error
    );
    // Invia una risposta con errore generico
    res.status(500).json({
      message: "Errore durante l'aggiornamento dell'utente nel database",
    });
  }
});

// API per aggiungere un nuovo squeal
app.post("/newSqueal", async (req, res) => {
  try {
    const newSqueal = new SquealModel(req.body);
    console.log("Squeal da aggiungere:");
    console.log(newSqueal);
    await newSqueal.save();
    res.status(201).json(newSqueal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante l'aggiunta dello squeal" });
  }
});

// Api per rimuovere uno specifico squeal
app.post("/removeSqueal", async (req, res) => {
  console.log("removeSqueal");
  try {
    console.log("entrato nel try");
    const squealId = req.body._id;
    console.log(req.body);
    console.log("id dello squeal da eliminare", squealId);
    const deletedSqueal = await SquealModel.findByIdAndDelete(squealId);
    console.log("squeal eliminato", squealId);

    if (deletedSqueal) {
      res.status(200).json({ message: "Squeal rimosso con successo" });
    } else {
      res.status(404).json({ error: "Squeal non trovato" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la rimozione dello squeal" });
  }
});

//API per aggiungere i destinatari e le reazioni di uno specifico squeal (di cui ho username del mittente)
app.post("/addRecv", async (req, res) => {
  console.log("body: " + req.body.idSqueal);
  try {
    //Cerco lo squeal da modificare
    const squeal = await SquealModel.findSquealById(req.body.idSqueal);
    if (squeal !== null) {
      // Aggiorna il campo destinatari con i nuovi utenti aggiunti
      squeal.destinatari = squeal.destinatari.concat(req.body.destinatari);
      console.log("destinatari aggiornati: " + squeal.destinatari);

      // Salva le modifiche nel database
      await squeal.save();

      // Invia una risposta di successo
      res.status(200).json({
        message: "Modifiche allo Squeal apportate con successo nel database",
      });
    } else {
      // Invia una risposta con errore se l'utente non è stato trovato
      res.status(404).json({ message: "Squeal non trovato nel database" });
    }
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento dello squeal nel database:",
      error
    );
    // Invia una risposta con errore generico
    res.status(500).json({
      message: "Errore durante l'aggiornamento dello squeal nel database",
    });
  }
});

app.post("/editEmoticonMD", async (req, res) => {
  try {
    //Cerco lo squeal da modificare
    const squeal = await SquealModel.findSquealById(req.body.idSqueal);
    console.log(
      "sono nella modifica emoticons",
      req.body.emoticonNum[0],
      req.body.emoticonNum[1]
    );
    if (squeal !== null) {
      squeal.emoticonNum.good = req.body.emoticonNum[0];
      squeal.emoticonNum.bad = req.body.emoticonNum[1];

      if (squeal.category !== "Private") {
        if (
          squeal.emoticonNum.good > 0.25 * squeal.impression &&
          squeal.emoticonNum.bad > 0.25 * squeal.impression
        ) {
          squeal.category = "Controversial";
        } else if (squeal.emoticonNum.good > 0.25 * squeal.impression) {
          squeal.category = "Popular";
        }
        else if (squeal.emoticonNum.bad > 0.25 * squeal.impression) {
          squeal.category = "Unpopular";
        }
      }
      await squeal.save();
      // Invia una risposta di successo
      res.status(200).json({
          message: "Modifiche allo Squeal apportate con successo nel database",
          newCategory: squeal.category,
        });
    } else {
      // Invia una risposta con errore se l'utente non è stato trovato
      res.status(404).json({ message: "Squeal non trovato nel database" });
    }
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento dello squeal nel database:",
      error
    );
    // Invia una risposta con errore generico
    res.status(500).json({
      message: "Errore durante l'aggiornamento dello squeal nel database",
    });
  }
});

//API per rimuovere i destinatari di uno specifico squeal (di cui ho username del mittente)
app.post("/remRecv", async (req, res) => {
  console.log("remRecv");
  console.log("body", req.body);
  try {
    //Cerco lo squeal da modificare
    const squeal = await SquealModel.findSquealById(req.body.idSqueal);
    if (squeal !== null) {
      console.log("pre modifica", squeal.destinatari);
      // Aggiorna il campo destinatari con i nuovi utenti aggiunti
      squeal.destinatari = squeal.destinatari
        .map((nome) => nome.trim())
        .filter((nome) => !req.body.destinatari.includes(nome));
      console.log("destinatari aggiornati: " + squeal.destinatari);
      // Salva le modifiche nel database
      await squeal.save();
      // Invia una risposta di successo
      res.status(200).json({
        message: "Modifiche allo Squeal apportate con successo nel database",
      });
    } else {
      // Invia una risposta con errore se l'utente non è stato trovato
      res.status(404).json({ message: "Squeal non trovato nel database" });
    }
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento dello squeal nel database:",
      error
    );
    // Invia una risposta con errore generico
    res.status(500).json({
      message: "Errore durante l'aggiornamento dello squeal nel database",
    });
  }
});

// API per ottenere la lista di tutti i canali
app.get("/channels", async (req, res) => {
  try {
    const channels = await ChannelModel.find();
    res.status(200).json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero dei canali" });
  }
});

// API per modificare la descrizione di un canale
app.post("/editChannelDescription", async (req, res) => {
  try {
    const channel = await ChannelModel.findChannelByName(req.body.name);
    if (channel !== null) {
      // Aggiorna i campi dell'utente con i nuovi valori
      channel.description = req.body.description;
      // Salva le modifiche nel database
      await channel.save();
      // Invia una risposta di successo
      res
        .status(200).json({ message: "Dati utente aggiornati con successo nel database" });
    } else {
      // Invia una risposta con errore se l'utente non è stato trovato
      res.status(404).json({ message: "Canale non trovato nel database" });
    }
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento del canale nel database:",
      error
    );
    // Invia una risposta con errore generico
    res.status(500).json({
      message: "Errore durante l'aggiornamento del canale nel database",
    });
  }
});

// API per aggiungere uno squeal nella lista squeal canale (Manuel)
app.post("/editChannelSqueal", async (req, res) => {
  try {
    console.log("editChannelSqueal");
    console.log("Entro nella modifica numero squeal del canale");
    const channel = await ChannelModel.findChannelByName(req.body.name);
    if (channel !== null) {
      // Aggiorna l'elenco degli squeal del canale con il nuovo ID dello squeal
      if (req.body.newSquealId) {
        console.log("squeal che si sta aggiungendo all'array");
        console.log(req.body.newSquealId);
        channel.listofSqueals.push(req.body.newSquealId);
      }
      await channel.save();
      res
        .status(200)
        .json({ message: "Canale aggiornato con successo nel database" });
    } else {
      res.status(404).json({ message: "Canale non trovato nel database" });
    }
  } catch (error) {
    console.error(
      "Errore durante aggiornamento del canale nel database:",
      error
    );
    res.status(500).json({
      message: "Errore durante aggiornamento del canale nel database",
    });
  }
});

// API per rimuovere uno squeal dalla lista squeal canale
app.post("/removeSquealFromChannel", async (req, res) => {
  try {
    console.log("removeSquealFromChannel");
    const { channelName, squealId } = req.body;

    // Trova il canale specifico
    const channel = await ChannelModel.findOne({ name: channelName });

    if (!channel) {
      return res.status(404).json({ message: "Canale non trovato" });
    }
    console.log("Elenco" + channel, squealId);
    // Rimuovi l'ID dello squeal dalla lista di squeal del canale
    channel.listofSqueals = channel.listofSqueals.filter(
      (id) => id.toString() !== squealId
    );
    console.log("listofSqueals" + channel.listofSqueals);

    await channel.save();

    res.status(200).json({ message: "Squeal rimosso dal canale con successo" });
  } catch (error) {
    console.error(
      "Errore durante la rimozione dello squeal dal canale:",
      error
    );
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// Api per ritornare gli squeal di uno specifico canale
app.get("/squealsByChannel", async (req, res) => {
  try {
    console.log("squealsByChannel");
    console.log(req.query);
    const channelId = req.query.channelId;
    console.log(channelId);
    const channel = await ChannelModel.findById(channelId);
    console.log(channel);
    if (!channel) {
      return res.status(404).send("Canale non trovato");
    }
    const squeals = await SquealModel.find({
      _id: { $in: channel.listofSqueals },
    });
    console.log(squeals);
    res.json(squeals);
  } catch (error) {
    res.status(500).send("Errore interno del server");
  }
});

app.post("/addChannelWithProfilePic", async (req, res) => {
  try {
    const newChannel = new ChannelModel({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      profilePic: req.body.profilePic,
      creators: [req.body.creator],
    });
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la creazione del canale" });
  }
});

// Api per aggiungere un canale
app.post("/addChannel", async (req, res) => {
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
    res.status(500).json({ error: "Errore durante la creazione del canale" });
  }
});

//Api per rimuovere un canale
app.post("/removeChannel", async (req, res) => {
  try {
    const channelName = req.body.name;
    // Utilizza il modello di Mongoose per trovare e rimuovere il canale per nome
    const deletedChannel = await ChannelModel.findOneAndDelete({
      name: channelName,
    });

    if (deletedChannel) {
      res.status(200).json({ message: "Canale rimosso con successo" });
    } else {
      res.status(404).json({ error: "Canale non trovato" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la rimozione del canale" });
  }
});

//APi che dà profile pic from username
app.post("/profilePicByUsername", async (req, res) => {
  try {
    const user = await UserModel.findByUsername(req.body.username);
    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }
    res.status(200).json({ image: user.image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.post("/search", async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
    let users = [],
      channels = [],
      keywordCounts = {};
    const loggedUser = req.body.username;

    if (searchTerm.startsWith("@")) {
      // Ricerca per utenti
      users = await UserModel.find({ username: new RegExp(searchTerm, "i") }); // i = case insensitive (maiuscole/minuscole non fanno differenza)
    } else if (searchTerm.startsWith("§")) {
      // Ricerca per canali
      channels = await ChannelModel.find({ name: new RegExp(searchTerm, "i") });
    } else if (searchTerm.startsWith("#")) {
      const regex = new RegExp(searchTerm.slice(1), "i"); // Rimuove '#' e prepara la regex
      const squeals = await SquealModel.find({
        text: regex,
        $or: [{ destinatari: loggedUser }, { destinatari: "@everyone" }],
      });
      squeals.forEach((squeal) => {
        const words = squeal.text.match(/#\w+/g); // Trova tutte le parole che iniziano con '#'
        if (words) {
          words.forEach((word) => {
            if (regex.test(word)) {
              // Aggiungi solo se corrisponde al termine di ricerca specifico
              keywordCounts[word] = (keywordCounts[word] || 0) + 1;
            }
          });
        }
      });
    }

    // Converti l'oggetto keywordCounts in un array di oggetti (per poterlo scorrere nel frontend)
    let keywordsArray = Object.keys(keywordCounts).map((key) => {
      return { keyword: key, count: keywordCounts[key] };
    });

    res.json({ users, channels, keywords: keywordsArray });
  } catch (error) {
    console.error("Errore durante la ricerca:", error);
    res.status(500).send("Si è verificato un errore durante la ricerca");
  }
});

//Api per ottenere, dato username, tutti i dati dell'utente (username è come query) const response = await axios.get(`http://localhost:3001/getUserByUsername/${username}`);
app.get("/getUserByUsername/:username", async (req, res) => {
  try {
    const username = req.params.username;
    console.log("parametro username:", username);
    const user = await UserModel.findByUsername(username);

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }
    res.status(200).json(user);
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

//Api per ottenere squeal con mittente uno username dato come query
app.get("/getPublicSquealsBySender/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const squeals = await SquealModel.findPublicSquealsBySender(username);
    res.status(200).json(squeals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

//api per ottenere numero di squeal pubblicati da un utente, somma totale numero di likes e dislikes dei suoi post
app.get("/getUserActivity/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const squeals = await SquealModel.findSquealsByUsername(username);
    let likes = 0;
    let dislikes = 0;
    squeals.forEach((squeal) => {
      likes += squeal.emoticonNum.good;
      dislikes += squeal.emoticonNum.bad;
    });
    res.status(200).json({ squeals: squeals.length, likes, dislikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.post("/deleteAccount", async (req, res) => {
  try {
    const username = req.body.username;

    const userSqueals = await SquealModel.findSquealsByUsername(username);
    for (let squeal of userSqueals) {
      await SquealModel.findByIdAndDelete(squeal._id);
    }

    // 2. Eliminare i commenti e le reazioni dell'utente dagli squeal di altri utenti
    const allSqueals = await SquealModel.find();
    for (let squeal of allSqueals) {
      const filteredComments = squeal.comments.filter(
        (comment) => comment.mittente !== username
      ); //la funzione filter restituisce un array con tutti gli elementi che soddisfano la condizione
      if (squeal.comments.length !== filteredComments.length) {
        // Se sono stati rimossi dei commenti
        squeal.comments = filteredComments;
        squeal.commentsNum = filteredComments.length;
      }

      ["verygood", "good", "bad", "verybad"].forEach((emotion) => {
        const index = squeal.emoticonGivenBy[emotion].indexOf(username); //calcolo l'index dell'utente nell'array delle reazioni (se non presente, indexOf restituisce -1)
        if (index !== -1) {
          squeal.emoticonGivenBy[emotion].splice(index, 1); //splice rimuove un numero di elementi a partire dall'index specificato )in questoc aso rimuove 1 elemento a partire da index
          squeal.emoticonNum[emotion] -= 1;
        }
      });

      await squeal.save();
    }

    await UserModel.deleteOne({ username });

    res.status(200).json({ message: "Account eliminato con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.get("/getChannelByChannelName/:channelName", async (req, res) => {
  try {
    const channelName = req.params.channelName;
    const channel = await ChannelModel.findChannelByName(channelName);
    if (!channel) {
      return res.status(404).json({ error: "Canale non trovato" });
    }
    res.status(200).json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.get("/getPublicSquealsByKeyword/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const squeals = await SquealModel.findPublicSquealsByKeyword(keyword);
    res.status(200).json(squeals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.post('/scheduleSqueal', async (req, res) => {
  const { squeal, intervalloInvio, numeroInvii } = req.body;
  console.log('Scheduling squeal con i seguenti dettagli:', squeal, intervalloInvio, numeroInvii);

  // Funzione per elaborare il testo dello squeal
  function processSquealText(text, numeroInvio, dataInvio) {
    const timeString = dataInvio.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const dateString = dataInvio.toLocaleDateString('it-IT');
    return text.replace("{NUM}", numeroInvio)
               .replace("{TIME}", timeString)
               .replace("{DATE}", dateString);
  }

  // Invia il primo "squeal" immediatamente
  if (numeroInvii >= 1) {
    const dataInvio = new Date();
    const textProcessed = processSquealText(squeal.text, 1, dataInvio); // Sostituzione per il primo invio

    try {
      const newSqueal = new SquealModel({
        ...squeal,
        text: textProcessed,
        date: dataInvio, // Imposta la data corrente per l'invio immediato
      });
      await newSqueal.save();
      console.log(`Squeal immediato inviato - Invio numero 1 di ${numeroInvii}`);
    } catch (error) {
      console.error('Errore durante il salvataggio dello squeal immediato:', error);
      return res.status(500).json({ message: 'Errore durante il salvataggio dello squeal immediato.' });
    }
  }

  // Verifica se è necessario programmare ulteriori invii
  if (numeroInvii > 1) {
    let inviiEffettuati = 1; // Inizia da 1 poiché il primo invio è già stato effettuato
    const cronExpression = `*/${intervalloInvio} * * * *`;
    let taskCompletata = false;

    const task = cron.schedule(cronExpression, async () => {
      if (inviiEffettuati < numeroInvii) {
        try {
          const dataInvio = new Date();
          const textProcessed = processSquealText(squeal.text, inviiEffettuati + 1, dataInvio);
          const newSqueal = new SquealModel({
            ...squeal,
            text: textProcessed,
            date: dataInvio, // Aggiunge la data corrente per ogni invio successivo
          });
          await newSqueal.save();
          inviiEffettuati++;
          console.log(`Squeal programmato inviato - Invio numero ${inviiEffettuati} di ${numeroInvii}`);
        } catch (error) {
          console.error('Errore durante il salvataggio dello squeal programmato:', error);
          task.stop(); // Considera di fermare il task se l'invio fallisce
        }
      } else {
        if (!taskCompletata) {
          console.log('Tutti gli invii programmati sono stati completati.');
          task.stop();
          taskCompletata = true; // Imposta la task come completata
        }
      }
    }, {
      scheduled: true
    });
  }

  res.json({ message: 'Squeal programmato con successo, primo invio effettuato immediatamente.' });
});

app.get('/randomImage', async (req, res) => {
  const accessKey = 'mwL0X9KXKbhFSNH60n-KvzoQY7PhTdXyfYmIXX8vbqc';
  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}`);
    const data = await response.json();
    res.json({ imageUrl: data.urls.regular });
  } catch (error) {
    console.error('Errore durante il recupero di un\'immagine casuale:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.get('/randomNews', async (req, res) => {
  const apiKey = 'c214f8be1062421dae64b6de673ca966';
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      const articles = data.articles;
      const randomArticle = articles[Math.floor(Math.random() * articles.length)];
      res.json(randomArticle);
  } catch (error) {
      console.error('Errore durante il recupero delle news:', error);
      res.status(500).json({ error: 'Errore interno del server' });
  }
});



app.post('/followChannel', async (req, res) => {
  const { username, channelName } = req.body;

  try {
      const user = await UserModel.findOneAndUpdate(
          { username },
          { $addToSet: { subscriptions: channelName } }, 
          { new: true } //mi restituisce il documento aggiornato
      );

      if (!user) {
          return res.status(404).json({ message: 'Utente non trovato' });
      }

      res.status(200).json({ message: 'Canale aggiunto alle sottoscrizioni dell\'utente', user });
  } catch (error) {
      console.error('Errore durante il follow del canale:', error);
      res.status(500).json({ message: 'Errore del server durante il follow del canale' });
  }
});

app.post('/unfollowChannel', async (req, res) => {
  const { username, channelName } = req.body;

  try {
      const user = await UserModel.findOneAndUpdate(
          { username },
          { $pull: { subscriptions: channelName } },
          { new: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'Utente non trovato' });
      }

      res.status(200).json({ message: 'Canale rimosso dalle sottoscrizioni dell\'utente', user });
  } catch (error) {
      console.error('Errore durante l\'unfollow del canale:', error);
      res.status(500).json({ message: 'Errore del server durante l\'unfollow del canale' });
  }
});







app.listen(3001, ()=>{
    console.log("Server is running")
})