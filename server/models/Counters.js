const mongoose=require('mongoose')

const CounterSchema=new mongoose.Schema({
    name:String,
    count:Number,
})

const CounterModel=mongoose.model("counters", CounterSchema, "counters") //"users"=collection's name; "userSchema"=schema's name; the third parameter (the name of the collection again is needed because otherwise MongoDB automatically adds the plural "s", I suppose because of the collections of objects)
module.exports=CounterModel