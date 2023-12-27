const mongoose = require('mongoose');

const SquealSchema = new mongoose.Schema({
    mittente: String,
    destinatari: [String], 
    data: Date,
    text: String,
    year: Number,
    commentsNum: Number,
    emoticonNum: {
        veygood: String,
        good: String,
        bad: String,
        verybad: String,
    },
    impression: Number,
    profilePic: String,
    bodyImage: String,
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

const SquealModel = mongoose.model("squeal", SquealSchema, "squeal");
module.exports = SquealModel;
