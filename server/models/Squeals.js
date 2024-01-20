const mongoose = require('mongoose');

const SquealSchema = new mongoose.Schema({
    mittente: String,
    destinatari: [String], 
    date: Date,
    text: String,
    commentsNum: Number,
    emoticonNum: {
        verygood: Number,
        good: Number,
        bad: Number,
        verybad: Number,
    },
    emoticonGivenBy:{
        verygood:[String],
        good:[String],
        bad:[String],
        verybad:[String],
    },
    impression: Number,
    impressionGivenBy: [String],
    profilePic: String,
    bodyImage: String,
    mapLocation: {
        lat: Number, // Latitudine
        lng: Number, // Longitudine
        zoom: Number // Livello di Zoom
    },
    category: String,
});



// Aggiungi la funzione statica dopo la definizione del modello
SquealSchema.statics.findSquealByUsername = async function (username) {
    try {
        const squeal = await this.findOne({ mittente: username });
            console.log("squeal:", squeal);
            return squeal;
    } catch (error) {
        console.error('Errore durante la ricerca degli squeals:', error);
        throw error;
    }
};

//Funzione che ritorna gli squeals che hanno come destinatario un utente specifico + tutti quelli pubblici (destinatario = "@everyone")
SquealSchema.statics.findSquealsToUser = async function (username) {
    try {
        let query;

        // Controllo se lo username è nella forma "guest_n"
        if (username==='@guest') {
            // Se sì, cerca solo gli squeals per questo username specifico
            query = { destinatari: username };
        } else {
            // Altrimenti, cerca sia per username sia per @everyone
            query = {
                $or: [
                    { destinatari: username },
                    { destinatari: '@everyone' }
                ]
            };
        }

        const squeals = await this.find(query).sort({ 'date': -1 }); // ordinati per data decrescente
        return squeals;
    } catch (error) {
        console.error('Errore durante la ricerca degli squeals:', error);
        throw error;
    }
};

const SquealModel = mongoose.model("squeals", SquealSchema, "squeals");
module.exports = SquealModel;
