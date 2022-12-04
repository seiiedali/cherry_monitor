// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';




// ==============Get and apply Memory Pie Chart======================
const diskChart = async () => {
  let jsonResponse = ''
  let diskRoute = routes['baseUrl'] + routes['apiRoute']['diskInfo']
  await $.get(diskInfo, (responseData) => jsonResponse = responseData)
  let parsedJson = await isJsonString(jsonResponse)
  for (let property in parsedJson) {
    let total = parsedJson[property]['Total Size']
    let available = parsedJson[property]['Free']
    let used = parsedJson[property]['Used']
    await applyDiskChart(available, used, total, property)

  }
  await $('#diskFooter').text('Uppdated: ' + getDate())

}




// =========Disk pie chart==========
const applyDiskChart = (available, used, total, name) => {
  let chartElement = `

    <div class="col-lg-6">
        <canvas id="${name}" width="100%" height="40"></canvas>
    </div>`
  $("#diskRow").append(chartElement)
  let ctx = document.getElementById(name);
  let availableMemory = parseFloat(available)
  let usedMemory = parseFloat(used)
  let totalMermory = parseFloat(total)
  let unavailable = (totalMermory - usedMemory - availableMemory).toFixed(2)
  // console.log(availableMemory, availableMemory, usedMemory, name, unavailable)

  var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    options: {
      title: {
        display: true,
        text: name
      },
      tooltips: {
        callbacks: {
          label: (tooltipItems, data) => {
            return data.labels[tooltipItems.index]+ ': ' + data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' GB';
          }
        }
      },
    },
    data: {
      labels: ["Used", "Available", "Unavailable"],
      datasets: [{
        data: [usedMemory, availableMemory, unavailable],
        backgroundColor: ['#dc3545', '#007bff', '#cac7d1'],
      }],
    },
  });
}
// ==========Get and Apply================
$(document).ready(() =>
  diskChart()
)