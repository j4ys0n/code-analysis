(function(w,$){
	"use strict";

	var doc = $(document),
		win = $(w),
		fileList,
		colors = {
			color1: '#E83175',
			highlight1: '#E85281',
			color2: '#FF4628',
			highlight2: '#FF674C',
			color3: '#E86819',
			highlight3: '#E87F3A',
			color4: '#FFAE2F',
			highlight4: '#FFBE53'
		},
		stats = {
			enclosureSpacing: {
				parenthesis: {
					both: 0,
					before: 0,
					after: 0,
					none: 0,
					total: 0
				},
				brackets: {
					both: 0,
					before: 0,
					after: 0,
					none: 0,
					total: 0
				},
				braces: {
					both: 0,
					before: 0,
					after: 0,
					none: 0,
					total: 0
				}
			},
			functions: {
				spaceAfterFunc: 0,
				noSpaceAfterFunc: 0,
				spaceAfterFuncAndParens: 0,
				noSpaceAfterFuncSpaceAfterParens: 0,
				total: 0
			},
			operators: {
				both: 0,
				before: 0,
				after: 0,
				none: 0
			}
		};

	function newElement(name){
		return document.createElement(name);
	}

	function addLegend(data, container){
		var i, li, number, label, numFiles;

		for(i = 0; i < data.length; i++){
			li = $(newElement('li')).css({ 'background-color': data[i].color });
			number = $(newElement('span')).text(data[i].value+'%').addClass('number');
			label = $(newElement('span')).text(data[i].label).addClass('label');
			li.append(number).append(label);
			container.append(li);
		}
	}

	function makeChart(){
		var parensData = [
			{
				value: Math.round(stats.enclosureSpacing.parenthesis.both/stats.enclosureSpacing.parenthesis.total*100),
				color: colors.color1,
				highlight: colors.highlight1,
				label: 'Space before and after each ( )'
			},
			{
				value: Math.round(stats.enclosureSpacing.parenthesis.before/stats.enclosureSpacing.parenthesis.total*100),
				color: colors.color2,
				highlight: colors.highight2,
				label: 'Space before (and after)'
			},
			{
				value: Math.round(stats.enclosureSpacing.parenthesis.after/stats.enclosureSpacing.parenthesis.total*100),
				color: colors.color3,
				highlight: colors.highlight3,
				label: 'Space after( and before )'
			},
			{
				value: Math.round(stats.enclosureSpacing.parenthesis.none/stats.enclosureSpacing.parenthesis.total*100),
				color: colors.color4,
				highlight: colors.highlight4,
				label: 'no spaces around ()'
			}],
			bracketsData = [
			{
				value: Math.round(stats.enclosureSpacing.brackets.both/stats.enclosureSpacing.brackets.total*100),
				color: colors.color1,
				highlight: colors.highlight1,
				label: 'Space before and after each [ ]'
			},
			{
				value: Math.round(stats.enclosureSpacing.brackets.before/stats.enclosureSpacing.brackets.total*100),
				color: colors.color2,
				highlight: colors.highight2,
				label: 'Space before [and after]'
			},
			{
				value: Math.round(stats.enclosureSpacing.brackets.after/stats.enclosureSpacing.brackets.total*100),
				color: colors.color3,
				highlight: colors.highlight3,
				label: 'Space after[ and before ]'
			},
			{
				value: Math.round(stats.enclosureSpacing.brackets.none/stats.enclosureSpacing.brackets.total*100),
				color: colors.color4,
				highlight: colors.highlight4,
				label: 'no spaces around []'
			}],
			bracesData = [
			{
				value: Math.round(stats.enclosureSpacing.braces.both/stats.enclosureSpacing.braces.total*100),
				color: colors.color1,
				highlight: colors.highlight1,
				label: 'Space before and after each { }'
			},
			{
				value: Math.round(stats.enclosureSpacing.braces.before/stats.enclosureSpacing.braces.total*100),
				color: colors.color2,
				highlight: colors.highight2,
				label: 'Space before {and after}'
			},
			{
				value: Math.round(stats.enclosureSpacing.braces.after/stats.enclosureSpacing.braces.total*100),
				color: colors.color3,
				highlight: colors.highlight3,
				label: 'Space after{ and before }'
			},
			{
				value: Math.round(stats.enclosureSpacing.braces.none/stats.enclosureSpacing.braces.total*100),
				color: colors.color4,
				highlight: colors.highlight4,
				label: 'no spaces around {}'
			}],
			functionsData = [
			{
				value: Math.floor(stats.functions.spaceAfterFunc/stats.functions.total*100),
				color: colors.color1,
				highlight: colors.highlight1,
				label: 'function (){'
			},
			{
				value: Math.floor(stats.functions.noSpaceAfterFunc/stats.functions.total*100),
				color: colors.color2,
				highlight: colors.highight2,
				label: 'function(){'
			},
			{
				value: Math.floor(stats.functions.spaceAfterFuncAndParens/stats.functions.total*100),
				color: colors.color3,
				highlight: colors.highlight3,
				label: 'function () {'
			},
			{
				value: Math.floor(stats.functions.noSpaceAfterFuncSpaceAfterParens/stats.functions.total*100),
				color: colors.color4,
				highlight: colors.highlight4,
				label: 'function() {'
			}],
			operatorsData = [
			{
				value: stats.operators.both,
				color: colors.color1,
				highlight: colors.highlight1,
				label: 'Space Before and after operator',
			},
			{
				value: stats.operators.after,
				color: colors.color2,
				highlight: colors.highlight2,
				label: 'Space after operator',
			},
			{
				value: stats.operators.before,
				color: colors.color3,
				highlight: colors.highlight3,
				label: 'Space before operator',
			},
			{
				value: stats.operators.none,
				color: colors.color4,
				highlight: colors.highlight4,
				label: 'No spaces around operator',
			}],
			parensCtx = document.getElementById('parens-chart').getContext('2d'),
			bracketsCtx = document.getElementById('brackets-chart').getContext('2d'),
			bracesCtx = document.getElementById('braces-chart').getContext('2d'),
			functionsCtx = document.getElementById('function-chart').getContext('2d'),
			operatorsCtx = document.getElementById('operators-chart').getContext('2d'),
			options = {segmentStrokeColor: '#666666', animationEasing: 'easeOutLinear'},
			parensChart = new Chart(parensCtx).Doughnut(parensData, options),
			bracketsChart = new Chart(bracketsCtx).Doughnut(bracketsData, options),
			bracesChart = new Chart(bracesCtx).Doughnut(bracesData, options),
			functionsChart = new Chart(functionsCtx).Doughnut(functionsData, options),
			operatorsChart = new Chart(operatorsCtx).Doughnut(operatorsData, options);

			addLegend(parensData, $('.parens ul'));
			addLegend(bracketsData, $('.brackets ul'));
			addLegend(bracesData, $('.braces ul'));
			addLegend(functionsData, $('.function ul'));
			addLegend(operatorsData, $('.operators ul'));
	}

	function getTotals(files){
		var i;
		fileList = files;
		for(i = 0; i < files.length; i++){
			stats.enclosureSpacing.parenthesis.both += parseInt(files[i].statsEnclosureSpacingParensBoth,10);
			stats.enclosureSpacing.parenthesis.before += parseInt(files[i].statsEnclosureSpacingParensBefore,10);
			stats.enclosureSpacing.parenthesis.after += parseInt(files[i].statsEnclosureSpacingParensAfter,10);
			stats.enclosureSpacing.parenthesis.none += parseInt(files[i].statsEnclosureSpacingParensNone,10);
			stats.enclosureSpacing.brackets.both += parseInt(files[i].statsEnclosureSpacingBracketsBoth,10);
			stats.enclosureSpacing.brackets.before += parseInt(files[i].statsEnclosureSpacingBracketsBefore,10);
			stats.enclosureSpacing.brackets.after += parseInt(files[i].statsEnclosureSpacingBracketsAfter,10);
			stats.enclosureSpacing.brackets.none += parseInt(files[i].statsEnclosureSpacingBracketsNone,10);
			stats.enclosureSpacing.braces.both += parseInt(files[i].statsEnclosureSpacingBracesBoth,10);
			stats.enclosureSpacing.braces.before += parseInt(files[i].statsEnclosureSpacingBracesBefore,10);
			stats.enclosureSpacing.braces.after += parseInt(files[i].statsEnclosureSpacingBracesAfter,10);
			stats.enclosureSpacing.braces.none += parseInt(files[i].statsEnclosureSpacingBracesNone,10);
			stats.functions.spaceAfterFunc += parseInt(files[i].statsSpaceAfterFunc,10);
			stats.functions.noSpaceAfterFunc += parseInt(files[i].statsNoSpaceAfterFunc,10);
			stats.functions.spaceAfterFuncAndParens += parseInt(files[i].statsSpaceAfterFuncAndParens,10);
			stats.functions.noSpaceAfterFuncSpaceAfterParens += parseInt(files[i].statsNoSpaceAfterFuncSpaceAfterParens,10);
			stats.operators.both += parseInt(files[i].statsOperatorsSpaceBeforeAndAfter,10);
			stats.operators.before += parseInt(files[i].statsOperatorsSpaceBefore,10);
			stats.operators.after += parseInt(files[i].statsOperatorsSpaceAfter,10);
			stats.operators.none += parseInt(files[i].statsOperatorsNoSpace,10);
		}
		//convert to percent
		stats.enclosureSpacing.parenthesis.total = stats.enclosureSpacing.parenthesis.both + stats.enclosureSpacing.parenthesis.before + stats.enclosureSpacing.parenthesis.after + stats.enclosureSpacing.parenthesis.none,
		stats.enclosureSpacing.brackets.total = stats.enclosureSpacing.brackets.both + stats.enclosureSpacing.brackets.before + stats.enclosureSpacing.brackets.after + stats.enclosureSpacing.brackets.none,
		stats.enclosureSpacing.braces.total = stats.enclosureSpacing.braces.both + stats.enclosureSpacing.braces.before + stats.enclosureSpacing.braces.after + stats.enclosureSpacing.braces.none,
		stats.functions.total = stats.functions.spaceAfterFunc + stats.functions.noSpaceAfterFunc + stats.functions.spaceAfterFuncAndParens + stats.functions.noSpaceAfterFuncSpaceAfterParens;


		makeChart();
	}

	function getData(){
		var req = $.ajax({
			url: '/api/files/js'
		})
		req.done(function(data){
			getTotals(data.data);
		});
	}

	function init(){
		getData();
	}

	doc.on('ready', init);

}(window, jQuery));
