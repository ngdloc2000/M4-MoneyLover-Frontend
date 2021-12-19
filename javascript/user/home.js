let currentUser = JSON.parse(localStorage.getItem("currentUser"));

function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/info/" + currentUser.id,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let avatar = `<img style="border-radius: 50%; height: 40px; width: 40px" src="../../img/${data.avatar}">`;
            let walletAvatar = `<img style="border-radius: 50%; height: 25px; width: 25px;" src="../../img/${data.avatar}">`;
            let name = `${data.name}`;
            document.getElementById('avatar-img').innerHTML = avatar;
            document.getElementById('name-user').innerHTML = name;
            document.getElementById('wallet-img').innerHTML = walletAvatar;
        }
    })
}

function getWalletByUser() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/wallets/walletByUserId/" + currentUser.id,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let balance = `${data.balance} <span>đ</span>`;
            let walletName = `<span id="wallet">${data.name}</span>`;
            document.getElementById('balace-wallet').innerHTML = balance;
            document.getElementById('wallet-name').innerHTML = walletName;
        }
    })
}
function logout() {
    event.preventDefault;
    localStorage.removeItem("currentUser")
    window.location.href = "../../view/user/login.html"
}


function getAllCategories() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/categories`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.length; i++) {
                content +=
                    `
                        <a onclick="toggleDiv(this)"><button style="border: none; background: white" value="${data[i].id}" onclick="showAllTypeCategory(this)">${data[i].name}</button></a>
                        <div id="types"></div>
                    `
            }
            document.getElementById('categoryList').innerHTML = content;
        }
    });
}

function showAllTypeCategory(a) {
    let id = a.getAttribute("value");
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/types/findAllTypeByCategory/" + id,
        success: function (result) {
            let content1 = "";
            for (let j = 0; j < result.length; j++) {
                content1 += `
                        <label>
                             <a name="MySelectInputName" value="${result[j].id}" onclick="showTypeSelected(this)">
                                                         <span>${result[j].name}</span>
                            </a>
                       </label>
                       `
            }
            document.getElementById("types").innerHTML = content1;
        }
    })
}

function showTypeSelected(e) {
    let typeId = e.getAttribute('value');
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/types/" + typeId,
        success: function (data) {
            let content = `<div class="NestedSelect">
                                            <a onclick="toggleDiv(this)"><button id="typeSend" value="${data.id}" style="border: none" onclick="getAllCategories()">${data.name}</button></a>
                                            <div id="categoryList">
                                            </div>
                                        </div>`
            document.getElementById('typeSelected').innerHTML = content;
        }
    })
}

function toggleDiv(element) {
    $(element).next('div').toggle('medium');

}

function getTypeInfo() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/wallets/walletByUserId/" + currentUser.id,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let balance = `${data.balance} <span>đ</span>`;
            let walletName = `${data.name}`;
            document.getElementById('balace-wallet').innerHTML = balance;
            document.getElementById('wallet-name').innerHTML = walletName;
        }
    })
}

getAllCategories();
getWalletByUser();
getUserInfo();