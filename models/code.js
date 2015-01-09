var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var urlify = require( 'urlify' ).create({
    spaces: '-',
    toLower: true,
    nonPritable: '-',
    trim: true
});

/**
 * Code model Schema
 * @type {Schema}
 */
var CodeSchema = new Schema({
    file: {type: String, default: ''},
    content: {type: String, default: ''},
    path: {type: String, default: ''},
    type: {type: String, default: ''},
    statsEnclosureSpacingParensBoth: {type: Number, default: 0},
    statsEnclosureSpacingParensBefore: {type: Number, default: 0},
    statsEnclosureSpacingParensAfter: {type: Number, default: 0},
    statsEnclosureSpacingParensNone: {type: Number, default: 0},
    statsEnclosureSpacingBracketsBoth: {type: Number, default: 0},
    statsEnclosureSpacingBracketsBefore: {type: Number, default: 0},
    statsEnclosureSpacingBracketsAfter: {type: Number, default: 0},
    statsEnclosureSpacingBracketsNone: {type: Number, default: 0},
    statsEnclosureSpacingBracesBoth: {type: Number, default: 0},
    statsEnclosureSpacingBracesBefore: {type: Number, default: 0},
    statsEnclosureSpacingBracesAfter: {type: Number, default: 0},
    statsEnclosureSpacingBracesNone: {type: Number, default: 0},
    statsSpaceAfterFunc: {type: Number, default: 0},
    statsNoSpaceAfterFunc: {type: Number, default: 0},
    statsSpaceAfterFuncAndParens: {type: Number, default: 0},
    statsNoSpaceAfterFuncSpaceAfterParens: {type: Number, default: 0}
});

//turn off autoindexing. helps with performance in production
CodeSchema.set( 'autoIndex', false );

//allow getters to be run on all documents when converting to Objects & JSON
CodeSchema.set( 'toObject', { getters: true, virtuals: false } );
CodeSchema.set( 'toJSON', { getters: true, virtuals: false } );

//model instance methods
CodeSchema.methods = {

};

//model static methods
CodeSchema.statics = {
    findById : function( id, callback ){
        this.findOne( { '_id': id } ).exec( callback );
    },
    findByFilename : function( file, callback ){
        this.findOne( { 'file': file } ).exec( callback );
    },
    findByPath : function( path, callback ){
        this.findOne( { 'path': path } ).exec( callback );
    }
}

mongoose.model( 'Code', CodeSchema );
