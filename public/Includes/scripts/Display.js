(function(w,$){
	"use strict";

	var doc = $(document),
		win = $(w),
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
				color: '#3366FF',
				highlight: '#99CCFF',
				label: 'Space before and after each ( )'
			},
			{
				value: stats.enclosureSpacing.parenthesis.before,
				color: '#FF3300',
				highlight: '#FF9966',
				label: 'Space before (and after)'
			},
			{
				value: stats.enclosureSpacing.parenthesis.after,
				color: '#33CC33',
				highlight: '#66FF99',
				label: 'Space after( and before )'
			},
			{
				value: stats.enclosureSpacing.parenthesis.none,
				color: '#CC00FF',
				highlight: '#CC99FF',
				label: 'no spaces around ()'
			}],
			bracketsData = [
			{
				value: stats.enclosureSpacing.brackets.both,
				color: '#3366FF',
				highlight: '#99CCFF',
				label: 'Space before and after each [ ]'
			},
			{
				value: stats.enclosureSpacing.brackets.before,
				color: '#FF3300',
				highlight: '#FF9966',
				label: 'Space before [and after]'
			},
			{
				value: stats.enclosureSpacing.brackets.after,
				color: '#33CC33',
				highlight: '#66FF99',
				label: 'Space after[ and before ]'
			},
			{
				value: stats.enclosureSpacing.brackets.none,
				color: '#CC00FF',
				highlight: '#CC99FF',
				label: 'no spaces around []'
			}],
			bracesData = [
			{
				value: stats.enclosureSpacing.braces.both,
				color: '#3366FF',
				highlight: '#99CCFF',
				label: 'Space before and after each { }'
			},
			{
				value: stats.enclosureSpacing.braces.before,
				color: '#FF3300',
				highlight: '#FF9966',
				label: 'Space before {and after}'
			},
			{
				value: stats.enclosureSpacing.braces.after,
				color: '#33CC33',
				highlight: '#66FF99',
				label: 'Space after{ and before }'
			},
			{
				value: stats.enclosureSpacing.braces.none,
				color: '#CC00FF',
				highlight: '#CC99FF',
				label: 'no spaces around {}'
			}],
			parensCtx = document.getElementById('parens-chart').getContext('2d'),
			bracketsCtx = document.getElementById('brackets-chart').getContext('2d'),
			bracesCtx = document.getElementById('braces-chart').getContext('2d'),
			options = {},
			parensChart = new Chart(parensCtx).Doughnut(parensData, options),
			bracketsChart = new Chart(bracketsCtx).Doughnut(bracketsData),
			bracesChart = new Chart(bracesCtx).Doughnut(bracesData);

			addLegend(parensData, $('.parens ul'));
			addLegend(bracketsData, $('.brackets ul'));
			addLegend(bracesData, $('.braces ul'));
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
		}
		makeChart();
	}

	function getData(){
		var req = $.ajax({
			url: 'http://localhost:8000/api/files/js'
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
