let currentUser = JSON.parse(localStorage.getItem("currentUser"));
function getContent(data, i) {
    return ` <tr>
            <td>${i+1}</td>    
            <td>${data[i].category.icon} ${data[i].category.name}</td>
            <td>${data[i].type.icon} ${data[i].type.name}</td>
            <td>
                <button onclick="editCateType(${data[i].id})">Edit</button>
            </td>
            <td>
                <button  onclick="removeCateType(${data[i].id})">Delete</button>
            </td>
        </tr>`
}
function getAllCateType() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/cateType`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.length; i++) {
                content += getContent(data, i)

            }
            $("#cateType").html(content);
        }
    });
    event.preventDefault();
}

function addNewCateType() {
    $.ajax({
        type:"GET",
        url:"http://localhost:8080/categories ",
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success:function (data){
            let contentCate = "";
            for (let i = 0; i < data.length; i++) {
                contentCate += `<option value="${data[i].id}">${data[i].name}</option>`
            }
            document.getElementById('categories').innerHTML = contentCate;
        }
    });
    $.ajax({
        type:"GET",
        url:"http://localhost:8080/types ",
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success:function (data){
            let contentType="";
            for (let i = 0; i < data.length; i++) {
                contentType += `<option value="${data[i].id}">${data[i].name}</option>`
            }
            document.getElementById('types').innerHTML = contentType;
        }
    });
    document.getElementById("addCateType").innerHTML = `<table>
        <tr>
            <td>Category:</td>
            <td> <select id="categories">
       
            </select></td>
        </tr>
           <tr>
            <td>Type:</td>
            <td> <select id="types">
       
            </select></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="submit" value="Create" onclick="addNew()"></td>
        </tr>
    </table>`
}
function addNew() {
    let category = $('#categories').val();
    let type = $('#types').val();
    let newCateType = {
        category: {
            id : category
        },
        type : {
            id: type
        }
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "POST",
        data: JSON.stringify(newCateType),
        url: `http://localhost:8080/cateType`,
        success: getAllCateType 

    });
    event.preventDefault();
}
function removeCateType(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/cateType/` + id,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: getAllCateType
    });
    event.preventDefault();
}

function editCateType(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/cateType/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (cateType){
            $.ajax({
                type:"GET",
                url:"http://localhost:8080/categories ",
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success:function (data){
                    let contentCate = "";
                    for (let i = 0; i < data.length; i++) {
                        contentCate += `<option  value="${data[i].id}">${data[i].name}</option>`
                    }
                    document.getElementById('categoriesEdit').innerHTML = contentCate;
                }
            });
            $.ajax({
                type:"GET",
                url:"http://localhost:8080/types ",
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success:function (data){
                    let contentType="";
                    for (let i = 0; i < data.length; i++) {
                        contentType += `<option value="${data[i].id}">${data[i].name}</option>`
                    }
                    document.getElementById('typesEdit').innerHTML = contentType;
                }
            });
            $("#editCateType").html( `<table>
         <tr>
            <td><input type="hidden" id="idEdit" value="${cateType.id}"></td>
        </tr>
        <tr>
            <td>Category:</td>
            <td> <select id="categoriesEdit">
       
            </select></td>
        </tr>
            <tr>
            <td>Type:</td>
            <td> <select id="typesEdit">
       
            </select></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="button" value="update" onclick="updateCateType()"></td>
        </tr>
    </table>`)
        }
    });
    event.preventDefault();
}
function updateCateType() {
    let  id = $('#idEdit').val();
    let category = $('#categoriesEdit').val();
    let type = $('#typesEdit').val();
    let newCateType = {
        id : id,
        category : {
            id: category
        },
        type : {
            id: type
        }
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentUser.token
        },
        type: "PUT",
        data: JSON.stringify(newCateType),
        url: `http://localhost:8080/cateType`,
        success: getAllCateType
    });
    event.preventDefault();
}