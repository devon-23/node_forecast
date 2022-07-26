var url_base = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
var api_key = 'F6WJPL5LWHX5DJV8ZDZJR6NEC'
let show = true
let config = {}
let chartDoc = document.getElementById('myChart').getContext('2d')
let myChart = new Chart(chartDoc, config);

getCities()

async function getWeather() {
    var json = ''
    document.querySelector(".popup-container").classList.remove("active")
    var city = document.getElementById('city').value
    var location = document.getElementById('location').value

    const res = await fetch(`${this.url_base}${location}?unitGroup=us&include=days&key=${this.api_key}&contentType=json`)

    console.log(res)
    if (res.status == 200) {
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
        json = await response.json()

        if (json !== '') {
            if(!alert(`Successfully added ${json}`)){window.location.reload();}
        } 
    } else {
        document.getElementById('wrong').innerHTML = "Could not add city. Maybe check spelling?"
    }
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
    document.querySelector(".popup-container").classList.remove("active")
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
                const popContainer = document.querySelector(".popup-container")

                if (this.show == true ) {
                    console.log("show")
                    popContainer.classList.remove("active")
                    this.show = false
                } else {
                    console.log("close")
                    this.show = true
                    popContainer.classList.add("active")
                }
                
                const points = myChart.getElementsAtEventForMode(e, 'nearest', {
                    intersect: true }, true)
                if(points[0]) {
                    const index = points[0]._index
                    const tr = document.querySelectorAll('tbody tr')[0]
                    tr.children[0].innerText = 'Date'
                    tr.children[1].innerText = 'High'
                    tr.children[2].innerText = 'Low'
                    tr.children[3].innerText = 'Average'
                    tr.children[4].innerText = 'Dew'
                    tr.children[5].innerText = 'UV Index'
                    tr.children[6].innerText = 'Condition'
                    tr.children[7].innerText = 'Description'

                    for (var i = 0; i <= 7; i++) {
                        const td = document.querySelectorAll('tbody tr')[i+1]
                        td.children[0].innerText = data[i].date
                        td.children[1].innerText = data[i].high
                        td.children[2].innerText = data[i].low
                        td.children[3].innerText = data[i].avg
                        td.children[4].innerText = data[i].dew
                        td.children[5].innerText = data[i].uv_index
                        td.children[6].innerText = data[i].conditions
                        td.children[7].innerText = data[i].weather_desc
                    }
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