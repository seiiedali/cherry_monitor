export { jsonToTable, logComponent }

const logComponent = (logData, fileName, readDirection, recordCount) => {
    console.log(logData)
    let data = logData
    if (isJsonString(logData)) {
        data = JSON.parse(logData)
    }

    let responseHtml =jsonToTable(data,'Log Records')
    
    return responseHtml
}

const jsonToTable = (jsonData, tableHeader = 'not set', level = 0) => {
    let data = jsonData
    if (isJsonString(jsonData)) {
        data = JSON.parse(jsonData)
    }

    const rowGenerator = () => {
        let rows = ``
        for (const property in data) {
            if ((typeof (data[property]) === "object") && (data[property] != null)) {
                rows += jsonToTable(data[property], property, level + 1)
            }
            else {
                rows +=
                    `
                    <tr>
                        <td> ${property}</td>
                        <td>${data[property]}</td>
                    </tr>
                    `
            }
        }
        return rows
    }
    let tableTemplate =
        `
        <table style="margin-left: ${(level * 20).toString()}px;" class="table">
            <thead class="thead-dark">
                <th><span> <strong>${tableHeader}</strong></span></th>
            </thead>
            <tbody>
                ${rowGenerator()}
            </tbody>
        </table>
        `
    return tableTemplate
};


const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}