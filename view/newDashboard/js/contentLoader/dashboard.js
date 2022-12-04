
// ============== Endpoints Data ===================
const loadDashboard = () => {
    infoCardApply('Network Traffic', 'network_IO', 'networkIO')
    infoCardApply('Disk I/O', 'disk_IO', 'diskIO')
    infoCardApply('System Boot', 'boot', 'systemBoot')
    infoCardApply('CPU Average Load', 'cpu_load', 'cpuAveLoad')
}


// ==============Get and apply Network Inreface Cards======================
const infoCardApply = async (cardName, dataKey, cardId) => {
    let jsonResponse = ''
    let sysinfoRoute = routes['baseUrl'] + routes['apiRoute']['systemInformation']
    await $.get(sysinfoRoute, (responseData) => jsonResponse = responseData)
    let parsedJson = await isJsonString(jsonResponse);
    let appliedHtml = await createList(cardName, cardId, parsedJson[dataKey])
    let sysinfoCardWrapper = await $(`#${cardId}`);
    await sysinfoCardWrapper.append(appliedHtml)
    await $(`#${cardId}-footer`).text('Fetched: ' + getDate())

}

// ================ Group List creater=======
const createList = (cardName, cardId , list) => {
    let listItems = ``
    for (let property in list) {
        listItems +=
            `
            <dt class="col-sm-8">
                <strong>${property}:</strong>
            </dt>
            <dd class="col-sm-4">
                <swam>${list[property]}</swamp>
            </dd>
            `
    }
    let listTemp =
        `
        

        <div class="card bg-secondary text-white mb-4">
        <div class="card-header">
            <i class="fas fa-bookmark me-1"></i>
            ${cardName}
            </div>
        <div class="card-body">
            <dl class="row">
                ${listItems}
            </dl>
        </div>
        <div id="${cardId}-footer"
            class="card-footer d-flex align-items-center justify-content-between">
        </div>
    </div>
        `
    return listTemp
}
// ==========Get and Apply================
$(document).ready(() =>
    loadDashboard()
)
