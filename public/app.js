var url_base = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
var api_key = ''

async function getWeather() {
    var location = document.getElementById('location').value
    const res = await fetch(`${this.url_base}${location}?unitGroup=us&key=${this.api_key}&contentType=json`)
    const results = await res.json()

    const dates = [results.days[0].datetime, results.days[1].datetime, results.days[2].datetime, results.days[3].datetime, results.days[4].datetime]
    const fiveDayAvgTemps = [results.days[0].temp, results.days[1].temp, results.days[2].temp, results.days[3].temp, results.days[4].temp,]
    const fiveDayMaxTemps = [results.days[0].tempmax, results.days[1].tempmax, results.days[2].tempmax, results.days[3].tempmax, results.days[4].tempmax,]
    const fiveDayMinTemps = [results.days[0].tempmin, results.days[1].tempmin, results.days[2].tempmin, results.days[3].tempmin, results.days[4].tempmin,]

    const data = {location, fiveDayAvgTemps, fiveDayMaxTemps, fiveDayMinTemps, dates}
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api', options)
    const json = await response.json()
    console.log(json)

    makeChart()
}

async function makeChart() {
    const response = await fetch('/api')
    const data = await response.json()
    //data[0].fiveDayAvgTemps

    let myChart = document.getElementById('myChart').getContext('2d');

    
    Chart.defaults.global.defaultFontFamily = 'Arial';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let temperature = new Chart(myChart, {
        type: 'bar', //bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: [data[0].dates[0], data[0].dates[1], data[0].dates[2], data[0].dates[3], data[0].dates[4]],
            datasets: [
                {
                    label: "High",
                    backgroundColor: "red",
                    data: [data[0].fiveDayMaxTemps[0], data[0].fiveDayMaxTemps[1], data[0].fiveDayMaxTemps[2], data[0].fiveDayMaxTemps[3], data[0].fiveDayMaxTemps[4]]
                },
                {
                    label: "Average",
                    backgroundColor: 'Yellow',
                    data: [data[0].fiveDayAvgTemps[0], data[0].fiveDayAvgTemps[1], data[0].fiveDayAvgTemps[2], data[0].fiveDayAvgTemps[3], data[0].fiveDayAvgTemps[4]]
                },
                {
                    label: "Low",
                    backgroundColor: 'blue',
                    data: [data[0].fiveDayMinTemps[0], data[0].fiveDayMinTemps[1], data[0].fiveDayMinTemps[2], data[0].fiveDayMinTemps[3], data[0].fiveDayMinTemps[4]]
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: `Weather forecast in ${data[0].location}`,
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