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

function addNewTransaction() {
    let name = $('#name').val();
    let amount = $('#amount').val();
    let date = $('#date').val();
    let file = $('#file')[0].files[0];
    let type = $('#typeSend').val();
    let fd = new FormData();
    let wallet = currentUser.id;
    fd.append("file", file);
    let newTransaction = {
        name: name,
        amount: amount,
        date: date,
        wallet: {
            id: wallet
        }
    }
    fd.append("newTransaction", JSON.stringify(newTransaction));
    $.ajax({
        url: "http://localhost:8080/transactions",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "POST",
        data: fd,
        success: function (data) {
            let idTransaction = data.id;
            let idType = type;
            let newTransacsionDetail = {
                transaction: {
                    id: idTransaction
                },
                type: {
                    id: idType
                }
            };
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.token
                },
                type: "POST",
                data: JSON.stringify(newTransacsionDetail),
                url: "http://localhost:8080/transactionDetails"
            })
        }
    })
}

function getContentTransaction(transaction) {
    return `  <tr> <td scope="row"> <span class="fa fa-briefcase mr-1"></span>${transaction.name} </td>
                <td class="text-muted">${transaction.date}</td>
                <td class="d-flex justify-content-end align-items-center"> <span class="fa fa-long-arrow-up mr-1"></span> ${transaction.amount} </td> </tr>`;
}

function showAllTransaction() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/transactions/findAll",
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.content.length; i++) {
                content += getContentTransaction(data.content[i]);
            }
            document.getElementById('showTransaction').innerHTML = content;
            document.getElementById('pageable').innerHTML = getPage(data);
        }
    });
}

function showAllTransactionByDate() {
    let a = $("#datetime").val();
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/transactions/findDate/"+a,

       success: function (beta) {
           let content = "";
           for (let i = 0; i < beta.length; i++) {
               content += getContentTransaction(beta[i]);
           }
           document.getElementById('showTransaction').innerHTML = content;
       }
    });
event.preventDefault();
}

function getPage(page) {
    if ( page.totalPages > (page.pageable.pageNumber + 1) ){
        return `<ul class="pagination">`+
            `<li class="page-item disabled">`+
            `<a  href="${page.pageable.pageNumber - 1}" onclick="page(this)" >previous</a>`+
            `</li>`+
            `<li class="page-item"><span>${page.pageable.pageNumber + 1}</span>/`+
            `<span>${page.totalPages}</span>`+
            `</li>`+
            `<li class="page-item"><a href="${page.pageable.pageNumber + 1}" onclick="page(this)" >next</a>`+
            `</li>`+
            `</ul>`
    }
    else {
        return `<ul class="pagination">`+
            `<li class="page-item disabled">`+
            `<a href="${page.pageable.pageNumber - 1}" onclick="page(this)" >previous</a>`+
            `</li>`+
            `<li class="page-item"><span>${page.pageable.pageNumber + 1}</span>/`+
            `<span>${page.totalPages}</span>`+
            `</ul>`
    }
}

function page(a) {
    let page = a.getAttribute("href");
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/transactions/findAll?page=" + page,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.content.length; i++) {
                content += getContentTransaction(data.content[i]);
            }
            document.getElementById('showTransaction').innerHTML = content;
            document.getElementById('pageable').innerHTML = getPage(data);
        }
    });
    event.preventDefault();
}


getAllCategories();
getWalletByUser();
getUserInfo();
showAllTransaction();