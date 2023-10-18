const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name:String,
    lastname:String,
    day:Number,
    month:Number,
    year:Number,
    proCheck:Boolean,
    email:String,
    password:String,
    image:String,
    description:String,
})

const UserModel=mongoose.model("users", UserSchema, "users") //"users"=collection's name; "userSchema"=schema's name; the third parameter (the name of the collection again is needed because otherwise MongoDB automatically adds the plural "s", I suppose because of the collections of objects)
module.exports=UserModel