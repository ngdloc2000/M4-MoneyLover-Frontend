function registerUser() {
    let name = $('#name').val();
    let dob = $('#dob').val();
    let phone = $('#phone').val();
    let username = $('#username1').val();
    let password = $('#password1').val();
    let avatar = $('#avatar')[0].files[0];
    let fd = new FormData();
    fd.append("file", avatar);
    let newUser = {
        name: name,
        dob: dob,
        phone: phone,
        username: username,
        password: password
    };
    fd.append("newUser", JSON.stringify(newUser));
    $.ajax({
        url: "http://localhost:8080/api/register",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        type: "POST",
        data: fd,
        success: function (data) {
            localStorage.setItem("currentUser", JSON.stringify(data));
            window.location.href = "../../view/user/login.html";
        }
    });
    event.preventDefault();
}