var mongoose = require( 'mongoose' );
var Code = mongoose.model( 'Code' );
var Response = require( __dirname + '/../lib/Response' );

module.exports = {
    addFile: function( req, res ){
        var file = new Code( req.body );
        delete file.id;
        file.save( function( err, file ){
            res.json( Response.code( err, file ), Response.data( err, file ) );
        });
    },
    getFilesByType: function( req, res ){
        var type = decodeURIComponent( req.params.type );
        Code.find( { 'type': type } ).exec( function( err, code ){
            res.json( Response.code( err, code ), Response.data( err, code ) );
        });
    },
    updateFileStats: function( req, res ){
        var id = decodeURIComponent( req.params.id ),
            updates = {
                $set: {},
                //$push: {}
            },
            updateMap = {
                $set: [
                    'statsEnclosureSpacingParensBoth',
                    'statsEnclosureSpacingParensBefore',
                    'statsEnclosureSpacingParensAfter',
                    'statsEnclosureSpacingParensNone',
                    'statsEnclosureSpacingBracketsBoth',
                    'statsEnclosureSpacingBracketsBefore',
                    'statsEnclosureSpacingBracketsAfter',
                    'statsEnclosureSpacingBracketsNone',
                    'statsEnclosureSpacingBracesBoth',
                    'statsEnclosureSpacingBracesBefore',
                    'statsEnclosureSpacingBracesAfter',
                    'statsEnclosureSpacingBracesNone',
                    'statsSpaceAfterFunc',
                    'statsNoSpaceAfterFunc',
                    'statsSpaceAfterFuncAndParens',
                    'statsNoSpaceAfterFuncSpaceAfterParens'
                ]
            },
            action;

        for(action in updateMap){
            if(updateMap.hasOwnProperty(action)){
                updateMap[action].forEach(function(element, index, array){
                    if(req.body[element]){
                        updates[action][element] = req.body[element];
                    }
                });
            }
        }
        Code.findByIdAndUpdate(id, updates, function(err, code){
            res.json(Response.code(err, code), Response.data(err, code));
        });
    },
    deleteFile: function( req, res ){
        var id = decodeURIComponent( req.params.id );
        Code.findOneAndRemove( {_id: id }, function( err, code ){
            res.json( Response.code( err, code ), Response.data( err, code ) );
        });
    }
};
