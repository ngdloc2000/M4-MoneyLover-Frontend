function getContent(data, i) {
    return ` <tr>
            <td>${i+1}</td>
            <td style="text-align: center">${data[i].name}</td>
            <td style="text-align: center">${data[i].icon}</td>
            <td>
                <button onclick="editType(${data[i].id})">Edit</button>
            </td>
            <td>
                <button  onclick="removeType(${data[i].id})">Delete</button>
            </td>
        </tr>`
}
function getAllType() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/types`,
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.length; i++) {
                content += getContent(data, i)

            }
            $("#type").html(content);
        }
    });
}

function addNewType() {
    document.getElementById("addType").innerHTML = `<table>
        <tr>
            <td>Name:</td>
            <td><input type="text" id="typeName" placeholder="name"></td>
        </tr>
        <tr>
            <td>Icon:</td>
            <td><input type="text" id="typeIcon" placeholder="icon"></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="submit" value="Tao Moi" onclick="addType()"></td>
       </tr>
    </table>`
}
function addType() {
    let name = $('#typeName').val();
    let icon = $('#typeIcon').val();
    let newType = {
        name : name,
        icon : icon,
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newType),
        url: `http://localhost:8080/types`,
        success: getAllType
    });
    event.preventDefault();
}
function removeType(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/types/` + id,
        success: getAllType
    });
    event.preventDefault();
}

function editType(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/types/${id}`,
        success : function (type) {

            $("#editType").html( `<table>
        <tr>
            <td><input type="hidden" id="id" value="${id}"></td>
        </tr>
        <tr>
            <td>Name:</td>
            <td><input style="width: 200px" type="text" id="name" value="${type.name}" placeholder="name"></td>
        </tr>
        <tr>
            <td>Icon:</td>
            <td><input type="text" id="icon" value="${type.icon}"/></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="button" value="update" onclick="updateType()"></td>
        </tr>
    </table>`) }
    });
}
function updateType() {
    let id = $('#id').val();
    let name = $('#name').val();
    let icon = $('#icon').val();
    let newType = {
        id : id,
        name : name,
        icon : icon,
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PUT",
        data: JSON.stringify(newType),
        url: `http://localhost:8080/types`,
        success: getAllType
    })
    event.preventDefault();
}

getAllType();