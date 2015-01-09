(function ( $, w, AppGlobal ){
	"use strict";
	var func = new Function();

	func = function Analyze( oSettings ){
		var oOptions,
		clickEvt,
		self = this,
		doc = $(document),
		files,
		parensTotals = {both: 0, before: 0, after: 0, none: 0},
		bracketsTotals = {both: 0, before: 0, after: 0, none: 0},
		bracesTotals = {both: 0, before: 0, after: 0, none: 0};
		self.oDefaults = {
			contentType: 'application/json; charset=utf-8'
		};
		//mix in the defaults and settings
		oOptions = $.extend( self.oDefaults, oSettings );
		//selector cache
		self.combinedSelectors = {};

		function updateFileStats(id, stats){
			var req = $.ajax({
				contentType: oOptions.contentType,
				url: '/api/file/'+id,
				type: 'POST',
				data: JSON.stringify( stats ),
				dataType: 'json',
				success: function( data ){
					//console.log(data);
				}
			});
			req.done(function( msg ){
				console.log( msg );
			});
		}

		function saveEnclosureStats(f, l, r, res){
			var both = 0,
				before = 0,
				after = 0,
				none = 0,
				stats = {};

			//both
			if(res[2].length <= res[6].length){
				both = res[2].length;
			}else{
				both = res[6].length;
			}
			//before/after
			if(res[0].length <= res[5].length){
				before = res[0].length;
			}else{
				before = res[5].length;
			}
			//after/before
			if(res[1].length <= res[4].length){
				after = res[1].length;
			}else{
				after = res[4].length;
			}
			//none
			if(res[3].length <= res[7].length){
				none = res[3].length;
			}else{
				none = res[7].length;
			}

			if(l === '('){
				stats.statsEnclosureSpacingParensBoth = both;
				stats.statsEnclosureSpacingParensBefore = before
				stats.statsEnclosureSpacingParensAfter = after;
				stats.statsEnclosureSpacingParensNone = none;
			}else if(l === '['){
				stats.statsEnclosureSpacingBracketsBoth = both;
				stats.statsEnclosureSpacingBracketsBefore = before;
				stats.statsEnclosureSpacingBracketsAfter = after;
				stats.statsEnclosureSpacingBracketsNone = none;
			}else if(l === '{'){
				stats.statsEnclosureSpacingBracesBoth = both;
				stats.statsEnclosureSpacingBracesBefore = before;
				stats.statsEnclosureSpacingBracesAfter = after;
				stats.statsEnclosureSpacingBracesNone = none;
			}

			updateFileStats(f._id, stats);
		}

		function enclosureAnalysis(f, l, r){
			var match, i,
				//left
				parensLeftSpaceBefore = [],
				parensLeftSpaceBeforeRegex = new RegExp('\\s\\'+l+'\\S', 'g'),
				parensLeftSpaceAfter = [],
				parensLeftSpaceAfterRegex = new RegExp('\\S\\'+l+'\\s', 'g'),
				parensLeftSpaceBeforeAndAfter = [],
				parensLeftSpaceBeforeAndAfterRegex = new RegExp('\\s\\'+l+'\\s', 'g'),
				parensLeftNoSpace = [],
				parensLeftNoSpaceRegex = new RegExp('\\S\\'+l+'\\S', 'g'),
				//right
				parensRightSpaceBefore = [],
				parensRightSpaceBeforeRegex = new RegExp('\\s\\'+r+'\\S', 'g'),
				parensRightSpaceAfter = [],
				parensRightSpaceAfterRegex = new RegExp('\\S\\'+r+'\\s', 'g'),
				parensRightSpaceBeforeAndAfter = [],
				parensRightSpaceBeforeAndAfterRegex = new RegExp('\\s\\'+r+'\\s', 'g'),
				parensRightNoSpace = [],
				parensRightNoSpaceRegex = new RegExp('\\S\\'+r+'\\S', 'g'),
				patterns = [
					parensLeftSpaceBeforeRegex, parensLeftSpaceAfterRegex, parensLeftSpaceBeforeAndAfterRegex,
					parensLeftNoSpaceRegex, parensRightSpaceBeforeRegex, parensRightSpaceAfterRegex,
					parensRightSpaceBeforeAndAfterRegex, parensRightNoSpaceRegex
				],
				results = [
					parensLeftSpaceBefore, parensLeftSpaceAfter, parensLeftSpaceBeforeAndAfter,
					parensLeftNoSpace, parensRightSpaceBefore, parensRightSpaceAfter,
					parensRightSpaceBeforeAndAfter, parensRightNoSpace
				];
			for(i = 0; i < patterns.length; i++){
				while((match = patterns[i].exec(f.content)) != null){
					results[i].push(match.index);
				}
			}
			saveEnclosureStats(f, l, r, results);
		}

		function saveFunctionStats(f, res){
			var stats = {}
			stats.statsSpaceAfterFunc = res[0].length;
			stats.statsNoSpaceAfterFunc = res[1].length;
			stats.statsSpaceAfterFuncAndParens = res[2].length;
			stats.statsNoSpaceAfterFuncSpaceAfterParens = res[3].length;
			updateFileStats(f._id, stats);
		}

		function functionAnalysis(f){
			var match, i,
				spaceAfterFunc = [],
				spaceAfterFuncRegex = new RegExp('function\\s\\([^\\)]*\\)\\{', 'g'),
				noSpaceAfterFunc = [],
				noSpaceAfterFuncRegex = new RegExp('function\\([^\\)]*\\)\\{', 'g'),
				spaceAfterFuncAndParens = [],
				spaceAfterFuncAndParensRegex = new RegExp('function\\s\\([^\\)]*\\)\\s\\{', 'g'),
				noSpaceAfterFuncSpaceAfterParens = [],
				noSpaceAfterFuncSpaceAfterParensRegex = new RegExp('function\\([^\\)]*\\)\\s\\{', 'g'),
				patterns = [
					spaceAfterFuncRegex, noSpaceAfterFuncRegex, spaceAfterFuncAndParensRegex, noSpaceAfterFuncSpaceAfterParensRegex
				],
				results = [
					spaceAfterFunc, noSpaceAfterFunc, spaceAfterFuncAndParens, noSpaceAfterFuncSpaceAfterParens
				];
			for(i = 0; i < patterns.length; i++){
				while((match = patterns[i].exec(f.content)) != null){
					results[i].push(match.index);
				}
			}
			saveFunctionStats(f, results);
		}

		function operatorAnalysis(f){
			var match, i,
				noSpace = [],
				noSpaceRegex = new RegExp('[^\\s,=,\\-,\\+,>,<,\\!,\\(,\\[,\\{,&]{1,}[=,\\-,\\+,>,<,\\!,(&{2})]{1,}[^\\s,=,\\-,\\+,>,<,\\!,\\),\\],\\,&}]{1,}'),
				spaceBefore = [],
				spaceBeforeRegex = new RegExp('[^\\s,=,\\-,\\+,>,<,\\!,\\(,\\),\\[,\\],\\{,\\},&]{1,}[\\s]+[=,\\-,\\+,>,<,\\!,(&{2})]{1,}[^\\s,=,\\-,\\+,>,<,\\!,\\),\\],\\,&}]{1,}'),
				spaceAfter = [],
				spaceAfterRegex = new RegExp(''),
				spaceBeforeAndAfter = [],
				spaceBeforeAndAfterRegex = new RegExp(''),
				patterns =[

				],
				results =[

				];
			for(i = 0; i < patterns.length; i++){
				while((match = patterns[i].exec(f.content)) != null){
					results[i].push(match.index);
				}
			}
			//saveOperatorStats(f, results);
		}

		function analyzeFile(f){
			enclosureAnalysis(f, '(', ')');
			enclosureAnalysis(f, '[', ']');
			enclosureAnalysis(f, '{', '}');
			functionAnalysis(f);
		}

		function analyzeFiles(){
			var i;
			for(i = 0; i < files.length; i++){
				analyzeFile(files[i]);
			}
		}

		function getFiles(){
			var req = $.ajax({
				url: 'http://localhost:8000/api/files/js'
			})
			req.done(function(data){
				files = data.data;
			});
		}

		function init(){
			getFiles();
		}


		doc
		.delegate('.analyze-files', 'click', function(e){
			analyzeFiles();
		});

		return {
			init: init
		}

	};
	func.prototype = AppGlobal.prototype;
	func.prototype.constructor = function Analyze(){ return false; };
	w.Analyze = func;
}( jQuery, window, AppGlobal ));
