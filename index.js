'use strict'

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/musifidb", (err,res)=>{
    if(err){
        throw err;
    }else{
        console.log("correct");
    }
});