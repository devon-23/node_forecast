var url_base = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
var api_key = ''

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
    console.log(json)

    makeChart()
}

async function makeChart() {
    const response = await fetch('/api')
    const data = await response.json()

    let myChart = document.getElementById('myChart').getContext('2d');

    
    Chart.defaults.global.defaultFontFamily = 'Arial';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let temperature = new Chart(myChart, {
        type: 'bar', //bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: [data[0].days[0].datetime, data[0].days[1].datetime, data[0].days[2].datetime, data[0].days[3].datetime, data[0].days[4].datetime],
            datasets: [
                {
                    label: "High",
                    backgroundColor: "red",
                    data: [data[0].days[0].tempmax, data[0].days[1].tempmax, data[0].days[2].tempmax, data[0].days[3].tempmax, data[0].days[4].tempmax]
                },
                {
                    label: "Average",
                    backgroundColor: 'Yellow',
                    data: [data[0].days[0].temp, data[0].days[1].temp, data[0].days[2].temp, data[0].days[3].temp, data[0].days[4].temp]
                },
                {
                    label: "Low",
                    backgroundColor: 'blue',
                    data: [data[0].days[0].tempmin, data[0].days[1].tempmin, data[0].days[2].tempmin, data[0].days[3].tempmin, data[0].days[4].tempmin]
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