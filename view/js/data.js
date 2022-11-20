
$(document).ready(() => {

    $("#sysinfo").click(
        () => $.getJSON(URL = 'http://localhost:8080/sysinfo',
            (data) => $('#content').html(jsonToTable(data, 'System Information'))
        )
    );

    $("#hdinfo").click(
        () => $.getJSON(URL = 'http://localhost:8080/hdinfo',
            (data) => $('#content').html(jsonToTable(data, 'Hardware Information')),
        )
    );

    $("#network").click(
        () => $.getJSON(URL = 'http://localhost:8080/network',
            (data) => {
                $('#content').html(jsonToTable(data, 'Network Information'));
                networkCards(data);
            }
        )
    );

    $('#links a').on(
        'click',
        (event) => {
            event.preventDefault()
        }
    )
})

const jsonToTable = (data, tableHeader) => {
    console.log(data)
    let obj = JSON.parse(data)
    let info_table =
        '<table class="table"><thead><tr><span>' + tableHeader + '</span></tr></thead><tbody>'
    for (const property in obj) {
        info_table += '<tr><td>' + property + '</td><td>' + obj[property] + '</td></tr>'
    }
    info_table += '</tbody></table>'
    return info_table
};

const networkCards = (data) => {
    let obj = JSON.parse(data);
    let interfaceTemplate = [

    ]
    let networkCard = '';
    for (const interface in obj['Interfaces']) {
        console.log(interface)
    }
};