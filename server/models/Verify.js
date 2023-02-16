const mongoose = require("mongoose");
const User = require('./Users');
const bcrypt = require("bcrypt");


const verifyEmailSchema = new mongoose.Schema({
          user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref: User,
                    required:true
          },
          token:{
                    type:String,
                    required:true
          },
          createdAt:{
                    type:Date,
                    required:true,
                    default:Date.now()
          },
          
})

verifyEmailSchema.pre("save" , async function(next){
          const salt = await bcrypt.genSalt(10);
          if(this.isModified("token")){
                    const hash = await bcrypt.hash(this.token , salt);
                    this.token = hash
          }
          next();
})

const verifyEmailModel = mongoose.model("token", verifyEmailSchema);
module.exports = verifyEmailModel;