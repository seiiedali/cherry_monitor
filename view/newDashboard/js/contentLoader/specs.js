// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';




// ==============Get and apply Network Inreface Cards======================
const applySysinfoCards = async () => {
    let jsonResponse = ''
    await $.get('http://localhost:8080/sysinfo', (responseData) => jsonResponse = responseData)
    let parsedJson = await isJsonString(jsonResponse);
    let sysinfoCardWrapper = await $("#specsTable");
    for (let property in parsedJson) {
        let sysinfoCard = await createSysinfoCard(property, parsedJson[property])
        // console.log(sysinfoCard)
        await sysinfoCardWrapper.append(sysinfoCard)
    }
    await $.get('http://localhost:8080/disk', responseData => jsonResponse = responseData)
    let parsedDisk = await isJsonString(jsonResponse)
    let diskCard = await createSysinfoCard('Disk', parsedDisk)
    await sysinfoCardWrapper.append(diskCard)
}

// =========Network Card==========
const createSysinfoCard = (sysinfoName, sysinfoData) => {
    let sysCard =
        `
        <div class="col mb-4">
            <div class="card">
                <div class="card-header">
                    <i class="fas fa-info-circle me-1"></i>
                    <strong>${sysinfoName}</strong> Specs
                </div>
                <div class="card-body">
                    ${jsonToTable(sysinfoData, sysinfoName)}
                </div>
                <div class="card-footer small text-muted">
                    Fetched: ${getDate()}
                </div>
            </div>
        </div>
        `
    return sysCard
}
// =============Json to Table=============
const jsonToTable = (jsonData, tableHeader = 'not set') => {

    const rowGenerator = () => {
        let rows = ``
        for (const property in jsonData) {
            if ((typeof (jsonData[property]) === "object") && (jsonData[property] != null)) {
                rows += jsonToTable(jsonData[property], property)
            }
            else {
                rows +=
                    `
                    <tr>
                        <td> ${property}</td>
                        <td>${jsonData[property]}</td>
                    </tr>
                    `
            }
        }
        return rows
    }
    let tableTemplate =
        `
        <table class="table">
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
// ==========Get and Apply================
$(document).ready(() =>
    applySysinfoCards()
)

