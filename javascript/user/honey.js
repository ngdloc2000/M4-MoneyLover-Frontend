let currentUser = JSON.parse(localStorage.getItem("currentUser"));
function showAmount() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/categories`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let id;
            for (let i = 0; i < data.length ; i++) {
                id = data[i].id;
            }
            $.ajax({
                type: "GET",
                url: `http://localhost:8080/transactions/sum/` + id,
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success: function (beta) {
                    if (id == 16) {
                        document.getElementById('expense').innerHTML = beta;
                    } else if (id==17) {
                        document.getElementById('income').innerHTML = beta;
                    }
                }
            })
        }
    });
    event.preventDefault();
}
showAmount();