$(document).ready(() => {
    // console.log('document ready');
    $("form").on(
        "submit",
        async (event) => {
            event.preventDefault();
            let inputUsername = $("[name='username']").val();
            let inputPassword = $("[name='password']").val();
            let loginData = {
                username: inputUsername,
                password: inputPassword
            };
            let url = 'http://localhost:8080/login';
            let result = null
            await $.getJSON(url, loginData, (data)=> result = data)
            result = await JSON.parse(result)
            await console.log(result['authenticated'])
            if(result['authenticated'] === true){
                window.location.replace("http://localhost:8080/view/dashboard/index.html");
            }
            else{
                $('#message').html(`<div class="alert alert-danger" role="alert">
                The entered <strong>username</strong> and/or <strong>password</strong> is wrong. Try Again!
              </div>`)
            }
        }
    )
    $('#test').on('click', ()=> {
        console.log('form submitted')
        alert('form submitted');
    })
}
)