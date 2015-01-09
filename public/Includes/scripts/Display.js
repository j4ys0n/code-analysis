(function(w,$){
	"use strict";

	var doc = $(document),
		win = $(w),
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
					none: 0
				},
				brackets: {
					both: 0,
					before: 0,
					after: 0,
					none: 0
				},
				braces: {
					both: 0,
					before: 0,
					after: 0,
					none: 0
				}
			},
			functions: {
				spaceAfterFunc: 0,
				noSpaceAfterFunc: 0,
				spaceAfterFuncAndParens: 0,
				noSpaceAfterFuncSpaceAfterParens: 0
			}
		};

	function newElement(name){
		return document.createElement(name);
	}

	function addLegend(data, container){
		var i, li, number, label;

		for(i = 0; i < data.length; i++){
			li = $(newElement('li')).css({ 'background-color': data[i].color });
			number = $(newElement('span')).text(data[i].value).addClass('number');
			label = $(newElement('span')).text(data[i].label).addClass('label');
			li.append(number).append(label);
			container.append(li);
		}
	}

	function makeChart(){
		var parensData = [
			{
				value: stats.enclosureSpacing.parenthesis.both,
				color: colors.color1,
				highlight: colors.highlight1,
				label: 'Space before and after each ( )'
			},
			{
				value: stats.enclosureSpacing.parenthesis.before,
				color: colors.color2,
				highlight: colors.highight2,
				label: 'Space before (and after)'
			},
			{
				value: stats.enclosureSpacing.parenthesis.after,
				color: colors.color3,
				highlight: colors.highlight3,
				label: 'Space after( and before )'
			},
			{
				value: stats.enclosureSpacing.parenthesis.none,
				color: colors.color4,
				highlight: colors.highlight4,
				label: 'no spaces around ()'
			}],
			bracketsData = [
			{
				value: stats.enclosureSpacing.brackets.both,
				color: colors.color1,
				highlight: colors.highlight1,
				label: 'Space before and after each [ ]'
			},
			{
				value: stats.enclosureSpacing.brackets.before,
				color: colors.color2,
				highlight: colors.highight2,
				label: 'Space before [and after]'
			},
			{
				value: stats.enclosureSpacing.brackets.after,
				color: colors.color3,
				highlight: colors.highlight3,
				label: 'Space after[ and before ]'
			},
			{
				value: stats.enclosureSpacing.brackets.none,
				color: colors.color4,
				highlight: colors.highlight4,
				label: 'no spaces around []'
			}],
			bracesData = [
			{
				value: stats.enclosureSpacing.braces.both,
				color: colors.color1,
				highlight: colors.highlight1,
				label: 'Space before and after each { }'
			},
			{
				value: stats.enclosureSpacing.braces.before,
				color: colors.color2,
				highlight: colors.highight2,
				label: 'Space before {and after}'
			},
			{
				value: stats.enclosureSpacing.braces.after,
				color: colors.color3,
				highlight: colors.highlight3,
				label: 'Space after{ and before }'
			},
			{
				value: stats.enclosureSpacing.braces.none,
				color: colors.color4,
				highlight: colors.highlight4,
				label: 'no spaces around {}'
			}],
			functionsData = [
			{
				value: stats.functions.spaceAfterFunc,
				color: colors.color1,
				highlight: colors.highlight1,
				label: 'function (){'
			},
			{
				value: stats.functions.noSpaceAfterFunc,
				color: colors.color2,
				highlight: colors.highight2,
				label: 'function(){'
			},
			{
				value: stats.functions.spaceAfterFuncAndParens,
				color: colors.color3,
				highlight: colors.highlight3,
				label: 'function () {'
			},
			{
				value: stats.functions.noSpaceAfterFuncSpaceAfterParens,
				color: colors.color4,
				highlight: colors.highlight4,
				label: 'function() {'
			}],
			parensCtx = document.getElementById('parens-chart').getContext('2d'),
			bracketsCtx = document.getElementById('brackets-chart').getContext('2d'),
			bracesCtx = document.getElementById('braces-chart').getContext('2d'),
			functionsCtx = document.getElementById('function-chart').getContext('2d'),
			options = {segmentStrokeColor: '#666666', animationEasing: 'easeOutLinear'},
			parensChart = new Chart(parensCtx).Doughnut(parensData, options),
			bracketsChart = new Chart(bracketsCtx).Doughnut(bracketsData, options),
			bracesChart = new Chart(bracesCtx).Doughnut(bracesData, options),
			functionsChart = new Chart(functionsCtx).Doughnut(functionsData, options);

			addLegend(parensData, $('.parens ul'));
			addLegend(bracketsData, $('.brackets ul'));
			addLegend(bracesData, $('.braces ul'));
			addLegend(functionsData, $('.function ul'));
	}

	function getTotals(files){
		var i;
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
		}
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
