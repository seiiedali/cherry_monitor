

$("#sysinfo").click(
    console.log('this happend') ,
    ()=>$.getJSON(URL='http://localhost:8080/sysinfo',
        (data)=> $('#content').replaceWith(sysinfo_tmp(data))
    )
);


const sysinfo_tmp = (data)=>{
    obj = JSON.parse(data)
    let info_table = 
    '<table class="table"><thead><tr><span>System Information</span></tr></thead><tbody>'
    for(const property in obj){
        info_table += '<tr><td>' + property + '</td><td>' + obj[property]+ '</td></tr>'
    }
    info_table += '</tbody></table>'       
    return info_table
};
    

// $(document).ready().then (()
//     $('#sysinfo').on(
//         'click',
//             ()=> $.getJSON(
//                 URL='http://localhost:8080/sysinfo',
//                 (data)=> $('#content').replaceWith(sysinfo_tmp(data))
//             )
//     )
// );