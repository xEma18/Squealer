const mongoose = require('mongoose');

const SquealSchema = new mongoose.Schema({
    mittente: String,
    destinatari: [String], 
    date: Date,
    text: String,
    commentsNum: Number,
    comments: [{
        mittente: String,
        text: String,
        date: Date,
        profilePic: String,
    }],
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

//Funzione che ritorna gli squeals che hanno come mittente un utente specifico
SquealSchema.statics.findSquealsByUsername = async function (username) {
    try {
        const squeals = await this.find({ mittente: username }).sort({ 'date': -1 }); // ordinati per data decrescente
        return squeals;
    } catch (error) {
        console.error('Errore durante la ricerca degli squeals:', error);
        throw error;
    }
};

SquealSchema.statics.findPublicSquealsBySender = async function (username) {
    try {
        const squeals = await this.find({ 
            mittente: username,
            destinatari: "@everyone" // Filtra per gli squeals pubblici
        }).sort({ 'date': -1 }); // Ordinati per data decrescente
        return squeals;
    } catch (error) {
        console.error('Errore durante la ricerca degli squeals pubblici:', error);
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

//trova squeals tramite keyword (case insensitive)
SquealSchema.statics.findPublicSquealsByKeyword = async function (keyword) {
    try {
        const squeals = await this.find({
            text: { $regex: new RegExp(keyword, 'i') }, 
            destinatari: '@everyone' 
        }).sort({ 'date': -1 }); 
        return squeals;
    } catch (error) {
        console.error('Errore durante la ricerca degli squeals:', error);
        throw error;
    }
};


const SquealModel = mongoose.model("squeals", SquealSchema, "squeals");
module.exports = SquealModel;
