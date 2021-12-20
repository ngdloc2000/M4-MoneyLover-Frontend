let currentUser= JSON.parse(localStorage.getItem("currentUser"));

// window.onload = function () {
//     var dataPoints = [];
//     var chart;
//     $.ajaxSetup({
//         headers: {
//             'Authorization': 'Bearer ' + currentUser1.token
//         }
//     });
//     $.getJSON("http://localhost:8080/transactions/sumAmountEachDayInMonth/1/1/12",
//         function (data) {
//             $.each(data, function (key, value) {
//                 dataPoints.push({y: parseInt(value.amount), label: parseInt(value.day)});
//             });
//             chart = new CanvasJS.Chart("chartContainer", {
//                 title: {
//                     text: "SỐ LƯỢNG TIỀN CHI RA MỖI NGÀY TRONG THÁNG"
//                 },
//                 data: [{
//                     type: "column",
//                     dataPoints: dataPoints,
//                 }]
//             });
//             chart.render();
//         });
// }

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
                        <option value="${data[i].id}">${data[i].name}</option>
                    `
            }
            document.getElementById('cateSelected').innerHTML = content;
        }
    });
}

function sumAmount () {
    let cateId = $('#cateSelected').val();
    let month = $('#month').val();
    let dataPoints = [];
    let chart;
    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        }
    });
    $.getJSON("http://localhost:8080/transactions/sumAmountEachDayInMonth/" + cateId + "/" + currentUser.id + "/" + month,
        function (data) {
            $.each(data, function (key, value) {
                dataPoints.push({y: parseInt(value.amount), label: parseInt(value.day)});
            });
            chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: "SỐ LƯỢNG TIỀN CHI RA MỖI NGÀY TRONG THÁNG"
                },
                data: [{
                    type: "column",
                    dataPoints: dataPoints,
                }]
            });
            chart.render();
        });
}

getAllCategories();