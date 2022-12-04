// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';




// ==============Get and apply Network Inreface Cards======================
const applyNetworkCards = async () => {
    let jsonResponse = ''
    let networkRoute = routes['baseUrl'] + routes['apiRoute']['netwokInterfaces']
    await $.get(networkRoute, (responseData) => jsonResponse = responseData)
    let parsedJson = await isJsonString(jsonResponse);
    let networkCardWrapper = await $("#networkCards");
    let interfaceCount = 0;
    for (let property in parsedJson) {
        let networkCard = await createNetworkCard(property, parsedJson[property], interfaceCount)
        await networkCardWrapper.append(networkCard)
        interfaceCount++;
    }
}

// =========Network Card==========
const createNetworkCard = (interfaceName, interfaceInfo, interfaceNumber) => {
    ip4Key = 'IPv4';
    ip6Key = 'IPv6';
    macKey = 'Physical';
    let accardion =
        `
        <div class="col mb-4">
        <div class="card">
            <div class="card-header">
                <i class="fas fa-network-wired me-1"></i>
                <strong>${interfaceName}</strong> Interface
            </div>
            <div class="card-body">
                <div class="accordion" id="accordionPanel-${interfaceNumber}-v4">
                    <div class="accordion-item">
                        <h2 class="accordion-header accordion-bg:bg-secondary" id="panelsStayOpen-heading-${interfaceNumber}-v4">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapse-${interfaceNumber}-v4" aria-expanded="true"
                                aria-controls="panelsStayOpen-collapse-${interfaceNumber}-v4">
                                <strong>IPV4 </strong>
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapse-${interfaceNumber}-v4" class="accordion-collapse collapse show"
                            aria-labelledby="panelsStayOpen-heading-${interfaceNumber}-v4">
                            <div class="accordion-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">IPV4 Address:&nbsp;&nbsp;&nbsp;&nbsp;<samp>${interfaceInfo[ip4Key]['IPv4 Address']}</samp></li>
                                    <li class="list-group-item">IPV4 Netmask: &nbsp;&nbsp;&nbsp;&nbsp;<samp>${interfaceInfo[ip4Key]['IPv4 Netmask']}</samp></li>
                                    <li class="list-group-item">IPV4 Broadcast: &nbsp;&nbsp;&nbsp;&nbsp;<samp>${interfaceInfo[ip4Key]['IPv4 Broadcast']}</samp></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion" id="accordionPanel-${interfaceNumber}-v6">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="panelsStayOpen-heading-${interfaceNumber}-v6">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapse-${interfaceNumber}-v6" aria-expanded="false"
                                aria-controls="panelsStayOpen-collapse-${interfaceNumber}-v6">
                                <strong>IPV6</strong>
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapse-${interfaceNumber}-v6" class="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-heading-${interfaceNumber}-v6">
                            <div class="accordion-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">IPV6 Address: &nbsp;&nbsp;&nbsp;&nbsp;<samp>${interfaceInfo[ip6Key]['IPv6 Address']}</samp></li>
                                    <li class="list-group-item">IPV6 Netmask: &nbsp;&nbsp;&nbsp;&nbsp;<samp>${interfaceInfo[ip6Key]['IPv6 Netmask']}</samp></li>
                                    <li class="list-group-item">IPV6 Broadcast: &nbsp;&nbsp;&nbsp;&nbsp;<samp>${interfaceInfo[ip6Key]['IPv6 Broadcast']}</samp></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion" id="accordionPanel-${interfaceNumber}-mac">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="panelsStayOpen-heading-${interfaceNumber}-mac">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapse-${interfaceNumber}-mac" aria-expanded="false"
                                aria-controls="panelsStayOpen-collapse-${interfaceNumber}-mac">
                                <strong>Physical Layer</strong>
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapse-${interfaceNumber}-mac" class="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-heading-${interfaceNumber}-mac">
                            <div class="accordion-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">MAC Address: &nbsp;&nbsp;&nbsp;&nbsp;<samp>${interfaceInfo[macKey]['MAC Address']}</samp></li>
                                    <li class="list-group-item">MAC Broadcast: &nbsp;&nbsp;&nbsp;&nbsp;<samp>${interfaceInfo[macKey]['Broadcast MAC']}</samp></li>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer small text-muted">
                Fetched: ${getDate()}
            </div>
        </div>
    </div>
    `
    return accardion
}
// ==========Get and Apply================
$(document).ready(() =>
    applyNetworkCards()
)