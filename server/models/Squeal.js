const mongoose = require('mongoose');

const SquealSchema = new mongoose.Schema({
    mittente: String,
    destinatari: [String], 
    date: Date,
    text: String,
    year: Number,
    commentsNum: Number,
    emoticonNum: {
        verygood: Number,
        good: Number,
        bad: Number,
        verybad: Number,
    },
    impression: Number,
    profilePic: String,
    bodyImage: String,
});



// Aggiungi la funzione statica dopo la definizione del modello
SquealSchema.statics.findSquealByUsername = async function (username) {
    console.log(username);
    try {
        const squeal = await this.findOne({ mittente: username });
            console.log("squeal:", squeal);
            return squeal;
    } catch (error) {
        console.error('Errore durante la ricerca degli squeals:', error);
        throw error;
    }
};

//Funzione che ritorna gli squeals che hanno come destinatario un utente specifico
SquealSchema.statics.findSquealsToUser = async function (username) {
    try {
        const squeals = await this.find({ destinatari: username }).sort({ 'data': -1 }); //ordinati per data decrescente
        return squeals;
    } catch (error) {
        console.error('Errore durante la ricerca degli squeals:', error);
        throw error;
    }
};
const SquealModel = mongoose.model("squeal", SquealSchema, "squeal");
module.exports = SquealModel;
