
$(document).ready(() => {

    $("#sysinfo").click(
        () => $.getJSON(URL = 'http://localhost:8080/sysinfo',
            (data) => $('#content').replaceWith(sysinfo_tmp(data))
        )
    );

    $('#links a').on(
        'click',
        (event) => {
            event.preventDefault()
            console.log(event)
        }
    )
})

const sysinfo_tmp = (data) => {
    obj = JSON.parse(data)
    console.log(data)
    let info_table =
        '<table class="table"><thead><tr><span>System Information</span></tr></thead><tbody>'
    for (const property in obj) {
        info_table += '<tr><td>' + property + '</td><td>' + obj[property] + '</td></tr>'
    }
    info_table += '</tbody></table>'
    return info_table
};