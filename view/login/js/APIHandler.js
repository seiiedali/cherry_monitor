$(document).ready(() => {
    // console.log('document ready');
    $("form").on(
        "submit",
        async (event) => {
            console.log('why this isnt working')
            event.preventDefault();
            let inputUsername = $("[name='username']").val();
            let inputPassword = $("[name='password']").val();
            let loginData = {
                username: inputUsername,
                password: inputPassword
            };
            // console.log('entered data', inputUsername, inputPassword)
            let url = 'http://localhost:8080/login';
            let result = null
            await $.getJSON(url, loginData, (data)=> result = data)
            result = await JSON.parse(result)
            // await console.log(result, typeof(result))
            // await console.log(result['authenticate'])
            if(result['authenticate'] === true){
                console.log('user is authenticate')
                window.location.replace("http://localhost:8080/view/dashboard/index.html");
            }
            else{
                $('#message').html(`<div class="alert alert-danger" role="alert">
                Entered username, password is wrong. Try Again!
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