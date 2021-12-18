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
            let name = `${data.name}`;
            document.getElementById('avatar-img').innerHTML = avatar;
            document.getElementById('name-user').innerHTML = name;
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
            document.getElementById('balace-wallet').innerHTML = balance;
        }
    })
}
function logout() {
    event.preventDefault;
    localStorage.removeItem("currentUser")
    window.location.href = "../../view/user/login.html"
}


getWalletByUser();
getUserInfo();