'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_secreta_curso";

exports.ensureAuth= function() {
    if(!req.headers.authorization){
        return res.status(403).send({message:"La petición no tiene la cabecera auth"});
    }
    
    var token = req.headers.authorization.replace(/['"]+/g,'');
    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:"El token ha expirado"});
        }
    }catch(ex){
        //console.log(ex);
        return res.status(403).send({message:"Token no valido"});
    }
    
    req.user = payload;
    next();
};

