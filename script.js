let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

let req = new XMLHttpRequest();

let data
let baseTemp
let values = []
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

let xScale
let yScale

let minYear
let maxYear
let numberOfYears = maxYear - minYear

let width = 1200
let height = 600
let padding= 60

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
  svg.attr('width', width)
  svg.attr('height', height)
}

let generateScales = () => {
  
  minYear = d3.min(values, (item) => {
    return item['year']
  })
  
  maxYear = d3.max(values, (item) => {
    return item['year']
  })
  
  xScale = d3.scaleLinear()
              .domain([minYear, maxYear + 1])
              .range([padding, width-padding])

  yScale = d3.scaleTime()
             .domain([new Date(0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
             .range([padding, height-padding])
}

let drawCells = () => {
  
  svg.selectAll('rect')
         .data(values)
         .enter()
         .append('rect')
         .attr('class', 'cell')
         .attr('fill', (d) => {
          let variance = d.variance
          if (variance <= -2) {
            return "#338E1B"
          } else if (variance > -2 && variance <= -1) {
            return '#60731E'
          } else if (variance > -1 && variance <= -0) {
            return '#D0BE49'
          } else if (variance > 0 && variance <= 1) {
            return '#AF5835'
          } else {
            return '#C80000'
          }
  })
        .attr('data-month', (d) => d.month - 1)
        .attr('data-year', (d) => d.year)
        .attr('data-temp', (d) => (baseTemp + d.variance))
        .attr('height', (height-(2*padding)) / 12)
        .attr('y', (d) => yScale(new Date(0, d['month'] - 1, 0, 0, 0, 0, 0)))
        .attr('width', (item) => {
              numberOfYears = maxYear - minYear
              return (width-(2*padding)) / numberOfYears
})
        .attr('x', (d) => xScale(d['year']))
        .on('mouseover', (event, item) => {
          tooltip.transition()
          tooltip.style('visibility', 'visible')
          tooltip.html(months[item.month -1] + " " + item.year + "<br>Variance: " + item.variance + "<br>Average Temp: " + (baseTemp + item.variance))
          tooltip.attr('data-year', item.year)
  })
  
      .on("mouseout", function(d) {
       tooltip.style('visibility', 'hidden')
  })
      
}

let generateAxes = () => {
  let xAxis = d3.axisBottom(xScale)
                 .tickFormat(d3.format('d'))
  let yAxis = d3.axisLeft(yScale)
                 .tickFormat(d3.timeFormat('%B'))
  
  svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr("transform", "translate(0, " + (height - padding) + ")")
  
  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr("transform", "translate(" + padding + ", 0)")
}

req.open('GET', url, true)
req.onload = () => {
  data = JSON.parse(req.responseText)
  baseTemp = data['baseTemperature']
  values = data.monthlyVariance
  drawCanvas()
  generateScales()
  drawCells()
  generateAxes()
}
req.send()