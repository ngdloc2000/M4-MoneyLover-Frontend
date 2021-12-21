let currentUser = JSON.parse(localStorage.getItem("currentUser"));

$(document).click(function(event) {
    if(
        $('.toggle > input').is(':checked') &&
        !$(event.target).parents('.toggle').is('.toggle')
    ) {
        $('.toggle > input').prop('checked', false);
    }
})

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
                url: "http://localhost:8080/transactionDetails",
                success: function (result) {
                    let typeId = result.type?.id;
                    $.ajax({
                        headers: {
                            'Authorization': 'Bearer ' + currentUser.token
                        },
                        type: "GET",
                        url: "http://localhost:8080/types/" + typeId,
                        success: function (data) {
                            if (data.category.id === 1) {
                                decreaseBalance(amount);
                                getAmountByExpense();
                                getAmountByIncome();
                            } else if (data.category.id === 2 || data.category.id === 3) {
                                increaseBalance(amount);
                                getAmountByExpense();
                                getAmountByIncome();
                            }
                            getWalletByUser();
                            showAllTransactionByUserId();
                        }
                    })
                }
            })
        }
    })
}

function decreaseBalance(amount) {
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "PUT",
        url: "http://localhost:8080/wallets/decreaseBalance/" + currentUser.id + "/" + amount,
    })
}

function increaseBalance(amount) {
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "PUT",
        url: "http://localhost:8080/wallets/increaseBalance/" + currentUser.id + "/" + amount,
    })
}


function showAllTransactionByUserId() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/transactions/showAllTransByWalletId/" + 1,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = ` <tr>
                <th scope="col">NAME</th>
                <th scope="col">DATE</th>
                <th scope="col" class="text-right">AMOUNT</th>
            </tr>`;
            for (let i = 0; i < data.length; i++) {
                content += getContentTransaction(data[i]);
            }
            document.getElementById('showTransaction').innerHTML = content;
            // document.getElementById('pageable').innerHTML = getPage(data);
        }
    });
    getAmountByExpense();
    getAmountByIncome();

}
function showTransactionDetail(a) {
    let id = a.getAttribute("href");
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/transactions/` + id,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = `<tr><th>Id</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>File</th>
                                <th>NameWallet</th></tr>
                                <tr><td>${data.id}</td>
                                <td>${data.name}</td>
                                <td>${data.amount}</td>
                                <td>${data.date}</td>
                                <td><img width="150" height="150" src="../../img/${data.file}" crossOrigin="anonymous"></td>
                                <td>${data.wallet.name}</td></tr>`
            document.getElementById('showTransaction').innerHTML = content;
        }
    });
    event.preventDefault();
}


function getContentTransaction(transaction) {
    return `<tr> <td scope="row"><a style="color: white" href="${transaction.id}" data-toggle="modal" data-target="#exampleModal1"onclick="showTransactionDetail(this)"> <span class="fa fa-briefcase mr-1" > </span>${transaction.name} </a></td>
                <td class="text-muted">${transaction.date}</td>
                <td class="d-flex justify-content-end align-items-center"> ${transaction.amount} </td> </tr>`;
}

function showAllSumAmountByCategoryId() {
                $.ajax({
                    headers: {
                        'Authorization': 'Bearer ' + currentUser.token
                    },
                    type: "GET",
                    url: "http://localhost:8080/transactions/showAllSumAmountByCategoryId/" + 1,
                    success: function (sum) {
                        document.getElementById("sum1").innerHTML = sum;
                    }
                })
            $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/transactions/showAllSumAmountByCategoryId/" + 2,
        success: function (sum) {
            document.getElementById("sum2").innerHTML = sum;
        }
    })
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/transactions/showAllSumAmountByCategoryId/" + 3,
        success: function (sum) {
            document.getElementById("sum3").innerHTML = sum;
        }
    })
    document.getElementById("showTransaction").innerHTML = getContentCategoryList();
}






function getContentCategoryList() {
    return `<tr><th>NAME CATEGORY</th>
            <th></th>
            <th>SUM AMOUNT</th> </tr>
            <tr>
                <td><button style="border: none; background-color: #212529; color: white" onclick="showAllTransactionByCategoryId1()">Chi Phí</button></td>
                <td></td>
                <td id="sum1"></td>
            </tr>
            <tr>
                <td><button style="border: none; background-color: #212529; color: white" onclick="showAllTransactionByCategoryId2()">Đi Vay</button></td>
                <td></td>
                <td id="sum2"></td>
            </tr>
            <tr>
                <td><button style="border: none; background-color: #212529; color: white" onclick="showAllTransactionByCategoryId3()">Thu Nhập</button></td>
                <td></td>
                <td id="sum3"></td>
            </tr>`
}


function showAllTransactionAndSumByDate() {
    let a = $("#datetime").val();
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/transactions/findDate/" + a,

        success: function (beta) {
            let content = ` <tr>
                <th scope="col">NAME</th>
                <th scope="col">Date</th>
                <th scope="col" class="text-right">Amount</th>
            </tr>`;
            for (let i = 0; i < beta.length; i++) {
                content += getContentTransaction(beta[i]);
            }
            document.getElementById('showTransaction').innerHTML = content;
        }
    })
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/transactions/sumAmountExpenseByDate/" + a,
        success: function (data) {
            document.getElementById('expense').innerHTML = data;

        }
    })
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/transactions/sumAmountIncomeByDate/" + a,
        success: function (data) {
            document.getElementById('income1').innerHTML = data;

        }
    });
    event.preventDefault();
}

function getAmountByExpense() {
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/transactions/sumAmountByExpense/" + currentUser.id,
        success: function (data) {
            document.getElementById('expense').innerHTML = data;
        }
    })
}

function getAmountByIncome() {
    $.ajax({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        type: "GET",
        url: "http://localhost:8080/transactions/sumAmountByIncome/" + currentUser.id,
        success: function (data) {
            document.getElementById('income1').innerHTML = data;
        }
    })
}

function getPage(page) {
    if (page.totalPages > (page.pageable.pageNumber + 1)) {
        return `<ul class="pagination">` +
            `<li class="page-item disabled">` +
            `<a  href="${page.pageable.pageNumber - 1}" onclick="page(this)" >previous</a>` +
            `</li>` +
            `<li class="page-item"><span>${page.pageable.pageNumber + 1}</span>/` +
            `<span>${page.totalPages}</span>` +
            `</li>` +
            `<li class="page-item"><a href="${page.pageable.pageNumber + 1}" onclick="page(this)" >next</a>` +
            `</li>` +
            `</ul>`
    } else {
        return `<ul class="pagination">` +
            `<li class="page-item disabled">` +
            `<a href="${page.pageable.pageNumber - 1}" onclick="page(this)" >previous</a>` +
            `</li>` +
            `<li class="page-item"><span>${page.pageable.pageNumber + 1}</span>/` +
            `<span>${page.totalPages}</span>` +
            `</ul>`
    }
}

function page(a) {
    let page = a.getAttribute("href");
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/transactions/showAllTransByWalletId?page=" + page,
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
function showAllTransactionByCategoryId1() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/transactions/findTransactionsByCategoryId/" + 1,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = ` <tr>
                <th scope="col">NAME</th>
                <th scope="col">DATE</th>
                <th scope="col" class="text-right">AMOUNT</th>
            </tr>`;
            for (let i = 0; i < data.length; i++) {
                content += getContentTransaction(data[i]);
            }
            document.getElementById('showTransaction').innerHTML = content;
            // document.getElementById('pageable').innerHTML = getPage(data);
        }
    });
}function showAllTransactionByCategoryId2() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/transactions/findTransactionsByCategoryId/" + 2,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = ` <tr>
                <th scope="col">NAME</th>
                <th scope="col">DATE</th>
                <th scope="col" class="text-right">AMOUNT</th>
            </tr>`;
            for (let i = 0; i < data.length; i++) {
                content += getContentTransaction(data[i]);
            }
            document.getElementById('showTransaction').innerHTML = content;
            // document.getElementById('pageable').innerHTML = getPage(data);
        }
    });
}function showAllTransactionByCategoryId3() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/transactions/findTransactionsByCategoryId/" + 3,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = ` <tr>
                <th scope="col">NAME</th>
                <th scope="col">DATE</th>
                <th scope="col" class="text-right">AMOUNT</th>
            </tr>`;
            for (let i = 0; i < data.length; i++) {
                content += getContentTransaction(data[i]);
            }
            document.getElementById('showTransaction').innerHTML = content;
            // document.getElementById('pageable').innerHTML = getPage(data);
        }
    });
}

getWalletByUser();
getAmountByExpense();
getAmountByIncome();
showAllTransactionByUserId();
getAllCategories();
getUserInfo();
showAllTransactionByCategoryId1();
showAllTransactionByCategoryId2();
showAllTransactionByCategoryId3();