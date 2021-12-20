let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// $.ajax({
//     type: "GET",
//     url: "http://localhost:8080/transactions/sumAmountEachDayInMonth/1/1/12",
//     headers: {
//         'Authorization': 'Bearer ' + currentUser.token
//     },
//     success: function (data) {
//         var dataPoints = [];
//         var chart;
//         $.each(data, function (key, value) {
//             dataPoints.push({x: value.day, y: parseInt(value.amount)});
//         });
//         chart = new CanvasJS.Chart("chartContainer", {
//             title: {
//                 text: "Số tiền chi ra mỗi ngày trong tháng"
//             },
//             data: [{
//                 type: "column",
//                 dataPoints: dataPoints,
//             }]
//         });
//         chart.render();
//     }
// })

window.onload = function () {
    var dataPoints = [];
    var chart;
    $.ajaxSetup({
        headers : {
            'Authorization': 'Bearer ' + currentUser.token
        }
    });
    $.getJSON("http://localhost:8080/transactions/sumAmountEachDayInMonth/1/1/12",
        function (data) {
        $.each(data, function (key, value) {
            dataPoints.push({x: parseInt(value.day), y: parseInt(value.amount)});
        });
        chart = new  CanvasJS.Chart("chartContainer",{
            title: {
                text: "Live Chart with dataPoints from External JSON"
            },
            data: [{
                type: "column",
                dataPoints: dataPoints,
            }]
        });
        chart.render();
    });
}