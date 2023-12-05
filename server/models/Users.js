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
    popolarita:String,
    caratteriGiornalieri:Number,
    caratteriSettimanali:Number,
    caratteriMensili:Number,
    status:String,
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

UserSchema.statics.findByNameAndLastname = async function(name, lastname) {
    try {
      const user = await this.findOne({ name: new RegExp('^' + name + '$', 'i') }); //Espressione regolare per togliere case sensitive (findOne ritorna l'intero oggetto del databse quindi l'utente in sé)
      if (user) {
        if (user.lastname === lastname) {
          return user;
        } else {
          return null;
        }
      } else {
        return null; // Utente non trovato
      }
    } catch (error) {
      console.error('Errore durante la ricerca dell\'utente:', error);
      throw error; 
    }
  };

  UserSchema.statics.findByUsername = async function(username) {
    console.log("username:"+username);
    try {
      const user = await this.findOne({username: username });
      console.log("user:"+user);
      return user; // Restituisci l'utente trovato o null se non trovato
    } catch (error) {
      console.error('Errore durante la ricerca dell\'utente:', error);
      throw error; 
    }
  };

const UserModel=mongoose.model("users", UserSchema, "users") //"users"=collection's name; "userSchema"=schema's name; the third parameter (the name of the collection again is needed because otherwise MongoDB automatically adds the plural "s", I suppose because of the collections of objects)
module.exports=UserModel