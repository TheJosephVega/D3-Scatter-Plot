d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(error, json) {
	
	var data = json;
	
	var margin = {top: 125, right: 100, bottom: 100, left: 100};
	var width = 1000 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;	
	
	var firstPlace = data[0]['Place'];
	var lastPlace = data[data.length- 1]['Place'] + 2; 
	
	var x = d3.time.scale()
		.domain([d3.max(data,function(d) {
				return new Date((d['Seconds'] - data[0]['Seconds']) * 1050);
			}), 0])
		.range([0, width]);
					
	var y = d3.scale.linear()
		.domain([firstPlace, lastPlace])
		.range([0, height]);
	
	var xAxis = d3.svg.axis()
			.orient("bottom")
			.scale(x)
			.tickFormat(d3.time.format('%M:%S'))
			.ticks(d3.time.seconds, 30);
		
	var yAxis = d3.svg.axis()
			.orient("left")
			.scale(y);
	
	var tip = d3.tip()
		.attr('class', 'tooltip')
		.offset([-10, 0])
		.html(function(d) {
			if (d['Doping'] === '') { 
				d['Doping'] = 'N/A';
			}
			return ("<span>" + "#" + d['Place'] + " " + d['Name'] + " (" + d['Nationality'] + ")" + "</span>" + 
					"<br><br>" + 
					"<span>" + "Year: " + d['Year'] + "</span>" + 
					"<br><br>" +   
					"<span>" + " Time: " + d['Time'] + "</span>" +
					"<br><br>" +
					"<span>" + "Doping: " + d['Doping'] + "</span>");
		});
			
	var chart = d3.select('#chart')
			.append('svg')
				.attr('height', height + margin.top + margin.bottom)
				.attr('width', width + margin.left + margin.right)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.call(tip);
	
	chart.append('g')
			.append('text')
				.text("Doping in Bicycle Racing: 35 Fastest times up Alpe d'Huez")
				.attr('id', 'title')
				.attr('font-size', '25px')
				.attr('x', 100)
				.attr('y', -55);
				
	chart.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0, ' + height + ')')
			.call(xAxis)
			.append('g')
				.append('text')
					.attr('x', 310)
					.attr('y', 70)
					.text('Minutes Behind Fastest Time');
	
	chart.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
			.append('g')
				.append('text')
					.attr('transform', 'rotate(-90)')
					.attr('x', -240)
					.attr('y', -60)
					.text('Ranking');
	
	chart.selectAll('.dot')
		.data(data)
		.enter()
			.append('circle')
				.attr('class', 'dot')
				.attr('fill', function(d) {
					if (d['Doping'] === '') { 
						return 'green';
					}
					else {
						return 'red'
					} 
				})
				.attr('r', 4)
				.attr('cx', function(d) { 
					return x(new Date((d['Seconds'] - data[0]['Seconds']) * 1000)); 
				})
				.attr('cy', function(d) { 
					return y(d['Place']); 
				})
				.on('mouseover', tip.show)
                .on('mouseout', tip.hide);
	
	chart.selectAll('.riderName')
		.data(data)
		.enter()
			.append('text')
				.text(function(d) {
					return d['Name'];
				})
				.attr('font-size', '11px')
				.attr('x' ,function(d) {
					return x(new Date((d['Seconds'] - data[0]['Seconds']) * 1000)); 
				})
				.attr('y', function(d) {
					return y(d['Place']); 
				})
				.attr('transform', 'translate(10,4)');
	
	chart.append('circle')
		.attr('class', 'dot')
		.attr('fill', 'red')
		.attr('r', 4)
		.attr('transform', 'translate(690, 200)');
	chart.append('text')
		.text('Doping Allegation')
		.attr('font-size', '11px')
		.attr('transform', 'translate(700, 204)');
	chart.append('circle')
		.attr('class', 'dot')
		.attr('fill', 'green')
		.attr('r', 4)
		.attr('transform', 'translate(690, 225)');
	chart.append('text')
		.text('No Doping Allegation')
		.attr('font-size', '11px')
		.attr('transform', 'translate(700, 229)');
});