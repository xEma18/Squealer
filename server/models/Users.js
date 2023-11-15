const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name:String,
    lastname:String,
    day:Number,
    month:Number,
    year:Number,
    proCheck:Boolean,
    username:String,
    email:String,
    password:String,
    image:String,
    description:String,
    tipoUtente:String,
    popolarità:String,
    caratteriGiornalieri:Number,
    caratteriSettimanali:Number,
    caratteriMensili:Number,
})

UserSchema.statics.findByCredentials=async function(username, password){
    const user=await this.findOne({username});
    if(user){ //controlla che user non sia null
        if(user.password===password){
            return user
        }else{
            return null
        }
    }
};





const UserModel=mongoose.model("users", UserSchema, "users") //"users"=collection's name; "userSchema"=schema's name; the third parameter (the name of the collection again is needed because otherwise MongoDB automatically adds the plural "s", I suppose because of the collections of objects)
module.exports=UserModel