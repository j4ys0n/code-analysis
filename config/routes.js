
// controllers

var code = require( __dirname + '/../controllers/code' );

module.exports = function(app) {
  app.get( '/', function( req, res ){
      res.render( 'index' );
  });
  app.get('/charts', function(req, res){
      res.render('charts');
  })
  //add file
  app.put('/api/file', code.addFile);
  //add files
  app.put('/api/files', code.addFiles);
  //get files by type
  app.get('/api/files/:type', code.getFilesByType);
  //update file stats
  app.post('/api/file/:id', code.updateFileStats);
  //delete file
  app.del('/api/file/:id', code.deleteFile);
};
