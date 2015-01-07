(function ( $, w, AppGlobal ){
	"use strict";
	var func = new Function();

	func = function Files( oSettings ){
		var oOptions,
		clickEvt,
		self = this,
		doc = $(document),
		fileList = [];
		self.oDefaults = {
			contentType: 'application/json; charset=utf-8',
			stash: false,
			//stashPath: 'http://jjacobs@stash.hugeinc.com/scm/',
			stashPath: 'https://stash.hugeinc.com/',
			gitPath: 'https://github.com/',
			stashFileClass: '.file-row a:not(.browse-up)',
			fileClass: '.files .content a',
			filePathInput: '.git-path',
			getFilesButton: '.get-files',
			printFilesButton: '.print-files',
			saveFileButton: '.save-files',
			fileListDisplay: '.file-list',
			fileNameClass: '.file-list ul li',
			fileContentDisplay: '.file-contents',
			getFileContentButton: '.get-file-content',
			rawFileURL: 'https://raw.githubusercontent.com/',
			excludes: ['require', 'jquery'],
			includes: ['.html', '.htm', '.css','.scss','.ejs','.js','.php']
		};
		//mix in the defaults and settings
		oOptions = $.extend( self.oDefaults, oSettings );
		//selector cache
		self.combinedSelectors = {};


		function getFileList( path ){
			console.log('getting files:', path);
			var domain = (oOptions.stash) ? domain = oOptions.stashPath : domain = oOptions.gitPath;
			var req = $.ajax({
				url: domain+path
			});
			req.done(function(data){
				var files;
				if(oOptions.stash){
					files = $(data).find(oOptions.stashFileClass);
				}else{
					files = $(data).find(oOptions.fileClass);
				}
				console.log(files);
				files.each(function(index){
					var t = $(this),
						path, id,
						include = false, i,
						filename, filetype;
					//t = t.prop('href').replace('http://localhost:8000/', 'https://github.com/');
					path = t.prop('href').replace('http://localhost:8000/', '').replace('/blob','');
					//path = path.replace('projects/projects', 'projects');
					if(path.indexOf('.') === -1){
						getFileList(path);
					}else{
						for(i = 0; i < oOptions.includes.length; i++){
							if(path.indexOf(oOptions.includes[i]) > -1){
								include = true;
							}
						}
						for(i = 0; i < oOptions.excludes.length; i++){
							if(path.indexOf(oOptions.excludes[i]) > -1){
								include = false;
							}
						}
						if(include){
							filename = path.substring(path.lastIndexOf('/')+1);
							filetype = path.substring(path.lastIndexOf('.')+1);
							fileList.push({path: path, content: '', file: filename, type: filetype});
							console.log(filename);
						}
					}
				});
			});
		}

		function getFileContent(){
			var req, i, f;

			for(i = 0; i < fileList.length; i++){
				var url;
				(oOptions.stash) ? url = oOptions.stashPath+fileList[i].path+'?raw' : url = oOptions.rawFileURL+fileList[i].path;
				req = $.ajax({
					url: url,
					dataType: 'text'
				})
				.done(function(data, status, xhr){
					var path = this.url, index = -1, i;
					path = path.replace(oOptions.rawFileURL, '');
					f = $( document.createElement('textarea') );
					index = fileList.indexOf(path);
					for(i = 0; i < fileList.length; i++){
						if(path === fileList[i].path){
							index = i;
						}
					}
					f.text(data).prop('id', index).addClass('item');;
					$(oOptions.fileContentDisplay).append(f);
					fileList[index].content = data;
				});

			}
		}

		function printFiles(){
			var list = $( document.createElement('ul') ),
				item, i;

			for(i = 0; i < fileList.length; i++){
				item = $( document.createElement('li') );
				item.text(fileList[i].path).prop('id', i);
				list.append(item);
			}

			$(oOptions.fileListDisplay).append( list );
		}

		function saveFile(item){
			var req = $.ajax({
				contentType: oOptions.contentType,
				url: '/api/file',
				type: 'PUT',
				data: JSON.stringify( item ),
				dataType: 'json'
			});
			req.done(function( msg ){
				//console.log(msg)
			});
			req.fail(function( jqXHR, textStatus ) {
				console.log( "Request failed: " + textStatus );
			});
		}

		function saveFiles(){
			var i, item;
			for(i = 0; i < fileList.length; i++){
				saveFile(fileList[i]);
			}
		}

		function init(){

		}


		doc
		.delegate(oOptions.getFilesButton, 'click', function(e){
			$(oOptions.fileListDisplay).empty();
			getFileList( $(oOptions.filePathInput).val() );
		})
		.delegate(oOptions.printFilesButton, 'click', function(e){
			printFiles();
		})
		.delegate(oOptions.getFileContentButton, 'click', function(e){
			getFileContent();
		})
		.delegate(oOptions.fileNameClass, 'mouseover', function(e){
			var t = $(this),
				id = t[0].id,
				f = $(oOptions.fileContentDisplay+' #'+id+'.item');
			f.siblings().removeClass('show');
			f.addClass('show');
		})
		.delegate(oOptions.saveFileButton, 'click', function(e){
			saveFiles();
		})

		return {
			init: init
		}

	};
	func.prototype = AppGlobal.prototype;
	func.prototype.constructor = function Files(){ return false; };
	w.Files = func;
}( jQuery, window, AppGlobal ));
