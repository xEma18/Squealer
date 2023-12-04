const mongoose=require('mongoose')

const SquealSchema=new mongoose.Schema({
    mittente:String,
    destinatari: {
        type: [String],  
    },
    data:Date,
    text:String,
    year:Number,
    emoticonNum: {
        veygood: String,
        good: String,
        bad: String,
        verybad: String,
    },
})

const SquealModel=mongoose.model("squeal", SquealSchema, "squeal") 
module.exports=SquealModel