function addNewUser() {
    let name = $('#name').val();
    let dob = $('#dob').val();
    let phone = $('#phone').val();
    let username = $('#username').val();
    let password = $('#password').val();
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
        url: "http://localhost:8080/api/create",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        type: "POST",
        data: fd,
        success: successHandler
    });
    event.preventDefault();
}


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

successHandler();