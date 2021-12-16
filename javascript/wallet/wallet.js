function getWallet(wallet) {
    return `<tr>
                        <td >${wallet.balance}</td>
                        <td >${wallet.name}</td>
                        <td >${wallet.users?.name}</td>` +
        `<td><button value="${wallet.id}" onclick="deleteWallet(this)">Delete</button></td>` +
        ` <td><button value="${wallet.id}" onclick="openForm(this)">Edit</button></td></tr>`

}

function successHandler() {
    $.ajax({
        type: "GET",
        //ten Api
        url: "http://localhost:8080/wallets/list",
        success: function (data) {
            let content = '   <tr>\n' +
                '        <th>Balance</th>\n' +
                '        <th>Name</th>\n' +
                '        <th>Users</th>\n' +
                '        <th>Delete</th>\n' +
                '        <th>Edit</th>\n' +
                '    </tr>';
            for (let i = 0; i < data.length; i++) {
                content += getWallet(data[i]);
            }
            document.getElementById('walletList').innerHTML = content;
        }
    });
}
successHandler();