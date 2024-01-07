const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    type: String,
    creators: [String], 
    name: String,
    description: String,
    followers: Number,
    listofSqueals: [String],
    status: String,
    postNum: [String],
    popolarity: String,
});

// Aggiungi la funzione statica dopo la definizione del modello
ChannelSchema.statics.findChannelByName = async function (name) {
    console.log(name);
    try {
        const channel = await this.findOne({ name: name });
            console.log("channel:", channel);
            return channel;
    } catch (error) {
        console.error('Errore durante la ricerca del canale:', error);
        throw error;
    }
};


const ChannelModel = mongoose.model("channels", ChannelSchema, "channels");
module.exports = ChannelModel;