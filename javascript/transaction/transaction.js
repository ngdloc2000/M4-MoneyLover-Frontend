let currentUser = JSON.parse(localStorage.getItem("currentUser"));

function getTransaction(data,i) {
    return `<tr>
                <td>${i+1}</td>
                <td>${data[i].amount}</td>
                <td>${data[i].date}</td>
                <td>${data[i].category?.name}</td>
                <td>${data[i].wallet?.name}</td>
                <td>${data[i].file}</td>
                <td>${data[i].name}</td>
                 <td>
                <button onclick="showEditTransaction(${data[i].id})">Edit</button>
            </td>
            <td>
                <button  onclick="DeleteTransaction(${data[i].id})">Delete</button>
            </td>
            </tr>`

}

function successHandler() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/transactiones" + currentUser.id,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success : function (data){
            let content =
            `<tr>` +
            `<th>Amount</th>` +
            `<th>Date</th>` +
            `<th>Category</th>` +
            `<th>Wallet</th>` +
            `<th>File</th>` +
            `<th>Name</th>` +
            `<th>Edit</th>` +
            `<th>Delete</th>` +
            `</tr>`
            for (let i = 0; i < data.length; i++) {
                content += getTransaction(data[i]);
            }
            document.getElementById('transactionList').innerHTML = content;
        }
    })
}
function addNewTransaction(){
    let amount = $('#amount').val();
    let date = $('#date').val();
    let category =$('#category')
    let wallet = $('#wallet').val();
    let file = $('#file').val();
    let name = $('#name').val();

    let newTransaction={
        amount:amount,
        date:date,
        category :{id:category},
        wallet:{id: wallet},
        file:file,
        name:name
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newTransaction),
        url: `http://localhost:8080/`,
        success: successHandler
    });
    }