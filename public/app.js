var url_base = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
var api_key = 'F6WJPL5LWHX5DJV8ZDZJR6NEC'

let config = {}
let chartDoc = document.getElementById('myChart').getContext('2d')
let myChart = new Chart(chartDoc, config);

getCities()

async function getWeather() {
    var location = document.getElementById('location').value
    const res = await fetch(`${this.url_base}${location}?unitGroup=us&include=days&key=${this.api_key}&contentType=json`)
    const results = await res.json()
    console.log(results)
    const day1 = results.days[0]
    const day2 = results.days[1]
    const day3 = results.days[2]
    const day4 = results.days[3]
    const day5 = results.days[4]

    const data = {day1, day2, day3, day4, day5, location}
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api', options)
    const json = await response.json()
    // location.reload();
    //makeChart()
}

async function getCities() {
    const response = await fetch('/cities')
    const data = await response.json()

    for (item of data) {
        var opt = document.createElement('option')
        opt.value = item.TABLE_NAME
        opt.innerHTML = item.TABLE_NAME
        document.getElementById('city').appendChild(opt)
    }
}

async function makeChart() {
    var city = document.getElementById('city').value
    var sendCity = {city: city}
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendCity)
    };
    const response = await fetch('/test', options)
    const data = await response.json()

    myChart.destroy()

    Chart.defaults.global.defaultFontFamily = 'Arial';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    myChart = new Chart(chartDoc, {
        type: 'bar', //bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: [data[0].date, data[1].date, data[2].date, data[3].date, data[4].date],
            datasets: [
                {
                    label: "High",
                    backgroundColor: "red",
                    data: [data[0].high, data[1].high, data[2].high, data[3].high, data[4].high]
                },
                {
                    label: "Average",
                    backgroundColor: 'Yellow',
                    data: [data[0].avg, data[1].avg, data[2].avg, data[3].avg, data[4].avg]
                },
                {
                    label: "Low",
                    backgroundColor: 'blue',
                    data: [data[0].low, data[1].low, data[2].low, data[3].low, data[4].low]
                }
            ]
        },
        options: {
            onClick: (e) => {
                const points = myChart.getElementsAtEventForMode(e, 'nearest', {
                    intersect: true }, true)
                if(points[0]) {
                    const index = points[0]._index
                    window.alert(data[index].weather_desc)
                }
            },
            title: {
                display: true,
                text: `Weather forecast in ${city}`,
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