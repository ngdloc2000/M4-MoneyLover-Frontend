let currentUser = JSON.parse(localStorage.getItem("currentUser"));

function getUser(user) {
    return `<tr>` +
        `<td><img width="100" height="100" src="../../img/${user.avatar}" crossOrigin="anonymous"></td>` +
        `<td>${user.name}</td>` +
        `<td>${user.dob}</td>` +
        `<td>${user.phone}</td>` +
        `<td><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editForm" value="${user.id}" onclick="showFormEdit(this)">Edit</button></td>` +
        `<td><button class="btn btn-primary" value="${user.id}" onclick="deleteUser(this)">Delete</button></td>` +
        `</tr>`;
}

function successHandler() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/list",
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content =
                `<tr>` +
                `<th>Ảnh đại diện</th>` +
                `<th>Tên khách hàng</th>` +
                `<th>Ngày sinh</th>` +
                `<th>Số điện thoại</th>` +
                `<th>Edit</th>` +
                `<th>Delete</th>` +
                `</tr>`
            for (let i = 0; i < data.length; i++) {
                content += getUser(data[i]);
            }
            document.getElementById('userList').innerHTML = content;
        }
    });
    event.preventDefault();
}
function showEdit() {
    let id = currentUser.id;
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/api/info/" + id,
        success: function (user) {
            $('#idEdit').val(user.id);
            $('#nameEdit').val(user.name);
            $('#dobEdit').val(user.dob);
            $('#avatarEdit').val(user.avartar);
            $('#usernameEdit').val(user.username);
            $('#passwordEdit').val(user.password);
        },
    })
}

function saveCustomer() {
    let id = currentUser.id;
    let name = $('#nameEdit').val();
    let dob = $('#dobEdit').val();
    let avatar = $('#avatarEdit')[0].files[0];
    let username = $('#usernameEdit').val();
    let password = $('#passwordEdit').val();
    let fd = new FormData();
    fd.append("file", avatar);
    let newUser = {
        id: id,
        name : name,
        dob : dob,
        username : username,
        password : password,
    };
    fd.append("newUser", JSON.stringify(newUser));
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token,
            'Access-control-allow-origin': '*'
        },
        type: "PUT",
        enctype: 'multipart/form-data',
        url: "http://localhost:8087/api/info/" + id,
        processData: false,
        contentType: false,
        cache: false,
        data: fd,
        success: function (data) {
            localStorage.setItem("currentUser", JSON.stringify(data));
        }
    });
    event.preventDefault();
}



successHandler();