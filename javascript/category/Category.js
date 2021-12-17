let currentUser = JSON.parse(localStorage.getItem("currentUser"));
function getContent(data, i) {
    return ` <tr>
            <td>${i+1}</td>
            <td style="text-align: center">${data[i].name}</td>
            <td style="text-align: center">${data[i].icon}</td>
            <td>
                <button onclick="editCategory(${data[i].id})">Edit</button>
            </td>
            <td>
                <button  onclick="removeCategory(${data[i].id})">Delete</button>
            </td>
        </tr>`
}
function getAllCategory() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/categories`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.length; i++) {
                content += getContent(data, i)

            }
            $("#category").html(content);
        }
    });
}

function addNewCategory() {

    document.getElementById("addCategory").innerHTML = `<table>
        <tr>
            <td>Name:</td>
            <td><input type="text" id="categoryName" placeholder="name"></td>
        </tr>
        <tr>
            <td>Icon:</td>
            <td><input type="text" id="categoryIcon" placeholder="icon"></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="submit" value="Tao Moi" onclick="addCategory()"></td>
       </tr>
    </table>`
}
function addCategory() {
    let name = $('#categoryName').val();
    let icon = $('#categoryIcon').val();
    let newCategory = {
        name : name,
        icon : icon,
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "POST",
        data: JSON.stringify(newCategory),
        url: `http://localhost:8080/categories`,
        success: getAllCategory
    });
    event.preventDefault();
}
function removeCategory(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/categories/` + id,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: getAllCategory
    });
    event.preventDefault();
}

function editCategory(id) {
    $.ajax({
            type: "GET",
            url: `http://localhost:8080/categories/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success : function (category) {

            $("#editCategory").html( `<table>
        <tr>
            <td><input type="hidden" id="id" value="${id}"></td>
        </tr>
        <tr>
            <td>Name:</td>
            <td><input style="width: 200px" type="text" id="name" value="${category.name}" placeholder="name"></td>
        </tr>
        <tr>
            <td>Icon:</td>
            <td><input type="text" id="icon" value="${category.icon}"/></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="button" value="update" onclick="updateCategory()"></td>
        </tr>
    </table>`) }
    });
}
function updateCategory() {
    let id = $('#id').val();
    let name = $('#name').val();
    let icon = $('#icon').val();
    let newCategory = {
        id : id,
        name : name,
        icon : icon,
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "PUT",
        data: JSON.stringify(newCategory),
        url: `http://localhost:8080/categories`,
        success: getAllCategory
    })
    event.preventDefault();
}

getAllCategory();