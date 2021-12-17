function logIn() {
    let username = $('#username').val();
    let password = $('#password').val();
    let data = {
        username: username,
        password: password
    }
    $.ajax({
        url: `http://localhost:8080/api/login`,
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function (result) {
            localStorage.setItem("currentUser", JSON.stringify(result));
            window.location.href = "../../view/user/home.html";
        }
    });
}