
const getLog = async ()=> {
    let jsonResponse = ''
    await $.get('http://localhost:8080/log?file_name=syslog&direction=head&line_count=100', (responseData)=> jsonResponse = responseData)
    let parsedJson = await isJsonString(jsonResponse)
    let table = await logHtml(parsedJson)
    await $('#tablePlaceholder').ready()
    await $('#tablePlaceholder').replaceWith(table)
    await $('#logTable').DataTable();
    await console.log('what the fuck is happening')
    
}

$(document).ready(getLog)
// ========Check Json Format=======
const isJsonString = (str) => {
    let parsed
    try {
        parsed = JSON.parse(str);
    } catch (e) {
        return str;
    }
    return parsed;
}

const logHtml =  (logData) =>{
    let tableRows = ``
    for(const log in logData){
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
    console.log(finalTable)
    return finalTable
}
