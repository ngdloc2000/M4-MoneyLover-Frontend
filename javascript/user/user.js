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

successHandler();