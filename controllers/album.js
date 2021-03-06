'use strict';
var path = require("path");
var fs = require("fs");
var mongoosePagination = require("mongoose-pagination");

var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");

function getAlbum(req,res) {
    var albumId = req.params.id;
    Album.findById(albumId).populate({path:'artist'}).exec((err,album)=>{
        if(err){
           res.status(500).send({message:"Error en la petición"});  
        }else{
            if(!album){
                res.status(404).send({message:"El album no existe"});  
            }else{
                res.status(200).send({album});  
            }
        }
    });
}

function getAlbums(req,res) {
    var artistId= req.params.id;
    if(!artistId){
        //sacar todos los albumes de la BD
        var find = Album.find({}).sort('title');
    }else{
        //sacar los albumes de un artista especifico de la BD
        var find = Album.find({artist:artistId}).sort('year');
    }
    
    find.populate({path:'artist'}).exec((err,albums)=>{
        if(err){
           res.status(500).send({message:"Error en la petición"});  
        }else{
            if(!albums){
                res.status(404).send({message:"No hay albums"});  
            }else{
                res.status(200).send({albums});  
            }
        }        
    });
}

function saveAlbum(req, res){
    var album = new Album();
    
    var params = req.body();
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;
    
    album.save((err,albumStored)=>{
       if(err){
           res.status(500).send({message:"error en el servidor"});
       }else{
           if(!albumStored){
               res.status(404).send({message:"No se ha guardado el album"});
           }else{
               res.status(200).send({album:albumStored});
           }
       }
    });
    
}

function updateAlbum(req,res) {
    var albumId = req.params.id;
    var update = req.body;
    
    Album.findByIdAndUpdate(albumId,update,(err,albumUpdated)=>{
       if(err){
           res.status(500).send({message:"error en el servidor"});
       }else{
           if(!albumUpdated){
               res.status(404).send({message:"No se ha actualizado el album"});
           }else{
               res.status(200).send({album:albumUpdated});
           }
       }
    });
}


function deleteAlbum(req,res) {
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId,(err,albumRemoved)=>{
                        if(err){
                            res.status(500).send({message:"error al eliminar el album"});
                        }else{
                            if(!albumRemoved){
                                res.status(404).send({message:"El album no ha sido borrado"});
                            }else{
                                Song.find({album:albumRemoved._id}).remove((err,songRemoved)=>{
    
                                    if(err){
                                        res.status(500).send({message:"error al eliminar las canciones"});
                                    }else{
                                        if(!songRemoved){
                                            res.status(404).send({message:"Las canciones no han sido borradas"});
                                        }else{
                                            res.status(200).send({artist:albumRemoved});
                                        }
                                    }   
                                                                      
                                });    
                            }
                        }                                                      
                    });        

}

function uploadImage(req,res) {
    var albumId = req.params.id;
    var file_name = 'No subido..';
    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(file_ext=='png'||file_ext=='jpg'||file_ext=='gif'){
            Album.findByIdAndUpdate(albumId,{image:file_name},(err,albumUpdated)=>{
        if(err){
            res.status(500).send({message:"Error-No se pudo agregar la imagen"});
        }else{
            if(!albumUpdated){
                res.status(404).send({message:"El usuario no ha podido loguearse"});
            }else{
                res.status(200).send({album:albumUpdated});
            }
        }
    });
        }else{
            res.status(200).send({message:"Extension de archivo no soportada"});
        }
    }else{
        res.status(200).send({message:"No ha subido imagen"});
    }
}

function getImageFile(req,res) {
    var image_file = req.params.imageFile;
    var path_file='./uploads/albums/'+image_file;
    fs.exists(path_file,function(exists) {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:"No existe la imagen"});
        }
    });
}

module.exports = {
    getAlbum,
    getAlbums,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}