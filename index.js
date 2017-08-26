'use strict'

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 2977;


mongoose.connect("mongodb://localhost:27017/musifidb", (err,res)=>{
    if(err){
        throw err;
    }else{
        console.log("correct");
        app.listen(port,function() {
            console.log("servidor escuchando");
        });
    }
});