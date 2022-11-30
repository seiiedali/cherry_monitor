// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';


// ==============Get and apply Memory Pie Chart======================
const cpuChart = async () => {
  let jsonResponse = ''
  await $.get('http://localhost:8080/cpu', (responseData) => jsonResponse = responseData)
  let parsedJson = await isJsonString(jsonResponse)
  let physicalCoresCount = parsedJson['Physical cores']
  let totalCoresCount = parsedJson['Total cores']
  let coresUsage = parsedJson['Cores usage']
  let cpuUsage = parsedJson['Total CPU Usage']
  let currentFrequency = parsedJson['Current Frequency']
  let maxFrequency = parsedJson['Max Frequency']
  let minFrequency = parsedJson['Min Frequency']

  await applyCpuChart(physicalCoresCount, totalCoresCount, cpuUsage, coresUsage, currentFrequency, maxFrequency, minFrequency)
  await $('#cpuFooter').text('Uppdated: ' + getDate())

}

// ==============
const applyCpuChart = async (physicalCoresCount, totalCoresCount, cpuUsage, coresUsage, currentFrequency, maxFrequency, minFrequency) => {

  var ctx = document.getElementById("cpuChart");
  coresArrayUsage = Object.values(coresUsage);
  coresIntUsage = coresArrayUsage.map(item => parseFloat(item))
  var myLineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(coresUsage),
      datasets: [{
        label: "Usage Percentage",
        backgroundColor: "rgba(2,117,216,1)",
        borderColor: "rgba(2,117,216,1)",
        data: coresIntUsage,
      }],
    },
    options: {
      tooltips: {
        callbacks: {
          label: (tooltipItems, data) => {
              return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' %';
          }
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            // maxTicksLimit: Number(totalCoresCount),
            style: 'percent',
          },
          gridLines: {
            display: true,
            color: "#e4e7ed",
          },
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            maxTicksLimit: 10,
            callback: value => value + "%"
          },
          gridLines: {
            display: true,
          }
        }],
      },
      legend: {
        display: false
      }
    }
  });
  await $('#cpuLoad').attr('aria-valuenow',parseFloat(cpuUsage))
  await $('#cpuLoad').css('width',cpuUsage)
  await $('#cpuLoad').text(cpuUsage)
  await $('#cpuCurrent').text(`Current: ${currentFrequency}`)
  await $('#cpuMax').text(`Max: ${maxFrequency}`)
  await $('#cpuMin').text(`Min: ${minFrequency}`)
  await $('#physicalCores').text(physicalCoresCount);
  await $('#totalCores').text(totalCoresCount);

}

// ==========Get and Apply================
$(document).ready(() =>
  cpuChart()
)