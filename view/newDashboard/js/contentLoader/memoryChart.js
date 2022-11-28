// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';




// ==============Get and apply Memory Pie Chart======================
const memoryChart = async () => {
  let jsonResponse = ''
  await $.get('http://localhost:8080/memory', (responseData) => jsonResponse = responseData)
  let parsedJson = await isJsonString(jsonResponse)
  let total = parsedJson['Virtual Memory']['Total']
  let available = parsedJson['Virtual Memory']['Available']
  let used = parsedJson['Virtual Memory']['Used']
  await applyMermoryChart(available, used, total)
  await $('#memoryFooter').text('Uppdated: ' + getDate())

}




// =========Memory pie chart==========
const applyMermoryChart = (available, used, total) => {
  let ctx = document.getElementById("memoryChart");
  let availableMemory = parseFloat(available)
  let usedMemory = parseFloat(used)
  let totalMermory = parseFloat(total)
  let unavailable = (totalMermory - usedMemory - availableMemory).toFixed(2)
  var myPieChart = new Chart(ctx, {
    type: 'pie',
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
  memoryChart()
)