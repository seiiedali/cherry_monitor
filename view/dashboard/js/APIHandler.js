
import { jsonToTable, logComponent } from './componentCreator.js'
import { baseConf } from './conf/apiEndPoints.js'
import { logForm } from './formsTemplate/logForm.js'

$(document).ready(() => {

    // Disable default redirecting of href in <a> tag
    $('#links a').on(
        'click',
        (event) => {
            event.preventDefault()
        }
    );

    // Handle sidebar request
    $('#sidebar-wrapper').on(
        'click', 'a',
        async (event) => {
            let requestTopic = await event.target.name
            let linkID = event.target.id;
            if (linkID != 'log') {
                let response = await getRequest(linkID);
                await flushContent();
                let responseHtml = await jsonToTable(response, requestTopic);
                await $('#content').html(responseHtml)
            } else if (linkID == 'log') {
                await flushContent();
                let form = logForm
                await $('#content').html(form)
            }

        }
    );

})

// Submit log request form
$("body").on(
    "submit",
    "form",
    async (event) => {
        await event.preventDefault()
        let fileName = await $("[name='file_name']").val();
        let readDirection = await $("[name='direction']").val();
        let recordCount = await $("[name='line_count']").val();
        let logData = {
            file_name: fileName,
            direction: readDirection,
            line_count: recordCount
        };
        let logResponse = await getRequest('log', logData);
        let logHtml = await logComponent(logResponse, fileName, readDirection,recordCount)
        // console.log(logHtml)
        await $('#content').html(logHtml)
    }
)

const flushContent = () => {
    $('#content').html('')
}


const getRequest = async (linkID, params='') => {
    let endpointUrl = baseConf.url + '/' + linkID 
    let response = await $.getJSON(URL = endpointUrl, params)
    return response
}


