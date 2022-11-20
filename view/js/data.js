
$(document).ready(() => {

    $('#links a').on(
        'click',
        (event) => {
            event.preventDefault()
        }
    )

    $("#sysinfo").click(
        () => $.getJSON(URL = 'http://localhost:8080/sysinfo',
            (data) => $('#content').html(jsonToTable(JSON.parse(data), 'System Information'))
        )
    );

    $("#hdinfo").click(
        () => {
            $.getJSON(URL = 'http://localhost:8080/hdinfo?hardware=cpu',
                (data) => $('#content').html(jsonToTable(JSON.parse(data), 'CPU Specs'))
            ).then(() =>
                $.getJSON(URL = 'http://localhost:8080/hdinfo?hardware=memory',
                    (data) => $('#content').append(jsonToTable(JSON.parse(data), 'Memory Specs'))
                )).then(() => $.getJSON(URL = 'http://localhost:8080/hdinfo?hardware=disk',
                    (data) => $('#content').append(jsonToTable(JSON.parse(data), 'Disk Specs'))
                ));
        }
    );

    $("#network").click(
        () => $.getJSON(URL = 'http://localhost:8080/network?req_type=interface',
            (data) => $('#content').html(jsonToTable(JSON.parse(data), 'Network Interfaces'))

        ).then(() => $.getJSON(URL = 'http://localhost:8080/network?req_type=traffic',
            (data) => $('#content').append(jsonToTable(JSON.parse(data), 'Network Traffic')))
        ));

})

const jsonToTable = (jsonData, tableHeader, level = 0) => {
    let data = jsonData
    const rowGenerator = () => {
        rows = ``
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
    tableTemplate =
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