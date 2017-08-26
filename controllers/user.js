'use strict'

var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");



function pruebas(req,res) {
    res.status(200).send({message:"exito controller"});
}


function saveUser(req,res){
    var user = new User();
    var params = req.body;
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';
    
    if(params.password){
        //encriptar contraseña
        bcrypt.hash(params.password,null,null,function(err,hash) {
            user.password = hash;
            if(user.name!=null && user.surname !=null && user.email != null){
                //guardar usuario
                user.save((err,userStored)=>{
                    if(err){
                        res.status(500).send({message:"Error al guardar el usuario"});
                    }else{
                        if(!userStored){
                            res.status(4404).send({message:"No se ha registrado el usuario"});
                        }else{
                            res.status(200).send({user:userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({user:userStored});
            }
        });
    }else{
        res.status(200).send({message:"Password no definida, favor ingresar"});
    }
}


module.exports = {
    pruebas,
    saveUser
};