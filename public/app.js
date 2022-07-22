var url_base = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
var api_key = ''

let config = {}
let chartDoc = document.getElementById('myChart').getContext('2d')
let myChart = new Chart(chartDoc, config);

async function getWeather() {
    var location = document.getElementById('location').value
    const res = await fetch(`${this.url_base}${location}?unitGroup=us&key=${this.api_key}&contentType=json`)
    const results = await res.json()

    const data = {results, location}
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api', options)
    const json = await response.json()
    // console.log(json)

    makeChart()
}

async function makeChart() {
    const response = await fetch('/api')
    const data = await response.json()

    myChart.destroy()

    var sortedData = data .sort((function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp) }));
    
    var opt = document.createElement('option')
    opt.vale = sortedData[0].location
    opt.innerHTML = sortedData[0].location
    document.getElementById('city').appendChild(opt)

    console.log(sortedData[0]);
    

    const recentData = sortedData[0].results
    if(recentData.alerts.length > 0) {
        window.alert(`WEATHER ADVISORY\n${recentData.alerts[0].event}\n${recentData.alerts[0].description}`)
    }

    Chart.defaults.global.defaultFontFamily = 'Arial';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    myChart = new Chart(chartDoc, {
        type: 'bar', //bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: [recentData.days[0].datetime, recentData.days[1].datetime, recentData.days[2].datetime, recentData.days[3].datetime, recentData.days[4].datetime],
            datasets: [
                {
                    label: "High",
                    backgroundColor: "red",
                    data: [recentData.days[0].tempmax, recentData.days[1].tempmax, recentData.days[2].tempmax, recentData.days[3].tempmax, recentData.days[4].tempmax]
                },
                {
                    label: "Average",
                    backgroundColor: 'Yellow',
                    data: [recentData.days[0].temp, recentData.days[1].temp, recentData.days[2].temp, recentData.days[3].temp, recentData.days[4].temp]
                },
                {
                    label: "Low",
                    backgroundColor: 'blue',
                    data: [recentData.days[0].tempmin, recentData.days[1].tempmin, recentData.days[2].tempmin, recentData.days[3].tempmin, recentData.days[4].tempmin]
                }
            ]
        },
        options: {
            onClick: (e) => {
                const points = myChart.getElementsAtEventForMode(e, 'nearest', {
                    intersect: true }, true)
                if(points[0]) {
                    // const dataset = points[0]._datasetIndex
                    const index = points[0]._index
                    var weather = recentData.days[index]
                    window.alert(`Weather Conditions: ${weather.conditions}`
                    + `\nWeather description: ${weather.description}`
                    )
                    // console.log(myChart.data.datasets[dataset].data[index])
                }
                console.log(points)
            },
            title: {
                display: true,
                text: `Weather forecast in ${sortedData[0].location}`,
                fontSize: 25
            },
            legend: {
                display: 'false',
                position: 'right',
                labels: {
                    fontColor: 'black'
                }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips: {
                enabled: true
            }
        }
    })
}