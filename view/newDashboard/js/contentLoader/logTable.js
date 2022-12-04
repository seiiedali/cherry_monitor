// ==============Flush Content=======================
const flushContent = () => {
    $('#content').html('')
}


// =================Submit log request form======================
// TODO This module need to be implemented
// const logRequestSubmit = () => {
//     $("body").on(
//         "submit",
//         "form",
//         async (event) => {
//             await event.preventDefault()
//             let fileName = await $("[name='file_name']").val();
//             let readDirection = await $("[name='direction']").val();
//             let recordCount = await $("[name='line_count']").val();
//             let logData = {
//                 file_name: fileName,
//                 direction: readDirection,
//                 line_count: recordCount
//             };
//             let logResponse = await getRequest('log', logData);
//             let logHtml = await logComponent(logResponse, fileName, readDirection, recordCount)
//             await $('#content').html(logHtml)
//         }
//     )
// }

// ==============Get and apply Log Data into table======================
const getLog = async () => {
    let jsonResponse = ''
    await $.get(`http://localhost:8080/api/log?file_name=${fileName}&direction=${direction}&line_count=${lineCount}`, (responseData) => jsonResponse = responseData)
    let parsedJson = await isJsonString(jsonResponse)
    let table = await logHtml(parsedJson)
    await $('#tablePlaceholder').ready()
    await $('#tablePlaceholder').replaceWith(table)
    await $('#logTable').DataTable();

}

// =========Create Log Table Html
const logHtml = (logData) => {
    let tableRows = ``
    for (const log in logData) {
        let description = logData[log].slice(5)
        let row =
            `
        <tr>
            <td>${Number(log) + 1}</td>
            <td>${logData[log][0]}</td>
            <td>${logData[log][1]}</td>
            <td>${logData[log][2]}</td>
            <td>${logData[log][3]}</td>
            <td>${logData[log][4]}</td>
            <td>${description.join(" ")}</td>
        </tr>
            `
        tableRows += row
    }
    finalTable =
        `
    <table id="logTable" class="table table-striped table-bordered" style="width:100%">
    <thead>
        <tr>
            <th>#</th>
            <th>Month</th>
            <th>Day</th>
            <th>Time</th>
            <th>Host Name</th>
            <th>Service</th>
            <th>Description</th>
        </tr>
    </thead>

    <tbody>
        ${tableRows}
    </tbody>
    </table>
    `
    return finalTable
}
// =============Get Log===================
$(document).ready(getLog)
