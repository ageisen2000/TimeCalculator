//TODO's
/*
- Only allow data refreshes if chart data actually updates.
- Drop down box for item type
- *** DATA VALIDATION ***
*/


var viewModel = new AppViewModel();
//variable to use to draw/destroy the chart
var myBarChart;

function parseDate(value) {
    var d = stripMicrosoftDate(value);
    return d.toLocaleDateString();
};

function toggleTable() {
    $("[id$=itemTable]").toggleClass('hidden');
};

function toggleInputPanel() {
    $("[id$=inputPanel]").toggleClass('hidden');
};
function toggleSpinner() {
    $("[id$=tableSpinner]").toggleClass('hidden');
};

function tableSuccessToggles() {
    toggleInputPanel();
    toggleTable();
    toggleSpinner();
    $("[id$=txtName]").focus();
};

function docReadyToggles() {
    toggleTable();
    toggleInputPanel();
};

//Testing function
function printDataToConsole(value) {
    //TODO: create new function to update database and show this alert
    showSuccessAlert("Test function success");
    console.log(JSON.stringify(ko.toJS(value), null, 2));
};

function showSuccessAlert(value) {
    //append the alert to the empty div
    $("[id$=alertDiv]").empty().append(
        '<div id= "alertDivPopulated" class="alert alert-success alert-dismissable"> ' +
        '<a href="#" class="close" data-dismiss="alert" aria-label="close" >×</a>' +
        '<strong>Success! </strong>' + value +
        '</div>');
    //slide the alert up after some seconds
    $("[id$=alertDivPopulated]").fadeTo(4000, 0.2).slideUp(500, function () {
        $("[id$=alertDivPopulated]").slideUp(500);
    });
};

function showFailureAlert(value) {
    //append the alert to the empty div
    $("[id$=alertDiv]").empty().append(
        '<div id= "alertDivPopulated" class="alert alert-danger alert-dismissable"> ' +
        '<a href="#" class="close" data-dismiss="alert" aria-label="close" >×</a>' +
        '<strong>' + value + '</strong> The update failed.' +
        '</div>');
    //slide the alert up after some seconds
    $("[id$=alertDivPopulated]").fadeTo(4000, 0.2).slideUp(500, function () {
        $("[id$=alertDivPopulated]").slideUp(500);
    });
};
function hideRow(value) {
    //$("#table_row_" + value.toString()).fadeTo("short", 0);
    viewModel.budgetItems.remove(value);
}
/*
This function will update a row on the database
when given a valid item object.
*/
function updateDbRow(value) {
    //TODO: replace value with an object?
    //var convertedDate = stripMicrosoftDate(value.ItemDate);
    var newItem = JSON.stringify({
        newItem: {
            ItemId: value.ItemId,
            ItemName: value.ItemName,
            ItemCost: value.ItemCost,
            ItemDate: value.ItemDate,
            //TODO Add ItemType back in
            //ItemType: 0,
        },
    });
    //optimistically update the value in the array
    viewModel.budgetItems()[viewModel.budgetItems().map(function (x) { return x.ItemId; }).indexOf(value.ItemId)] = value;

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "../Services/ItemService.asmx/UpdateItem",
        data: newItem,
        dataType: "json",
        success: function (response) {
            console.log("AJAX Response Update: " + response.responseText);
            showSuccessAlert("Update successful");
            viewModel.budgetItems(response.d);
            populateChart();
        },
        error: function (response) {
            console.log("AJAX Response Error Update: " + response.responseText);
            showFailureAlert("Record update failed!");
        }
    });
};

function deleteDbRow(value, rowid) {
    console.log("Rowid: " + rowid + " value: " + value);
    //TODO: add an "are you sure" button
    var delItem = JSON.stringify({
        delItem: {
            ItemId: value.ItemId,
            ItemName: value.ItemName,
            ItemCost: value.ItemCost,
            ItemDate: value.ItemDate,
            //TODO Add ItemType back in
            //ItemType: 0,
        },
    });
    //remove the item from the list optimistically
    hideRow(value);

    //reload the list based on the database
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "../Services/ItemService.asmx/DeleteItem",
        data: delItem,
        dataType: "json",
        success: function (response) {
            console.log("AJAX Success Delete: " + response.responseText);
            showSuccessAlert("Delete successful");
            viewModel.budgetItems(response.d);
            populateChart();
        },
        error: function (response) {
            console.log("AJAX Response Error Delete: " + response.responseText);
            showFailureAlert("Record delete failed");
        }
    });
};

function addDbRow(value) {
    var converted = ko.toJS(value);
    var addItem = JSON.stringify({
        addValue: {
            ItemId: converted.budgetItemAdd.ItemId,
            ItemName: converted.budgetItemAdd.ItemName,
            ItemCost: converted.budgetItemAdd.ItemCost,
            ItemDate: converted.budgetItemAdd.ItemDate,
            //TODO Add ItemType back in
            //ItemType: 0,
        },
    });
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "../Services/ItemService.asmx/AddItem",
        data: addItem,
        dataType: "json",
        success: function (response) {
            console.log("AJAX Success Add: " + response.responseText);
            showSuccessAlert("Add successful");
            viewModel.budgetItems(response.d);
            populateChart();
        },
        error: function (response) {
            console.log("AJAX Response Error Add: " + response.responseText);
            showFailureAlert("Failed while adding record");
        }
    });
};

function populateTable() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "../Services/ItemService.asmx/GetItems",
        data: "{}",
        dataType: "json",
        success: function (response) {
            tableSuccessToggles();
            viewModel.budgetItems(response.d);
        },
        error: function (response) {
            console.log("Populate Table Failure: " + response.responseText);
            showFailureAlert();
        }
    });
};

function populateChart() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "../Services/ItemService.asmx/GetItemsByDate",
        data: "{}",
        dataType: "json",
        success: function (response) {
            RedrawChart(response.d);
        },
        error: function (response) {
            console.log("Populate Chart Failure: " + response.responseText);
            showFailureAlert();
        }
    });
};

function RedrawChart(value) {
    var ctx = $("#myChart");
    var chartCosts = [];
    var chartDates = [];
    this.chartItems = ko.observableArray(value);
    this.fillColors = [];

    for (var i = 0; i < this.chartItems().length; i++) {
        chartDates.push(parseDate(this.chartItems()[i].ItemDate));
        chartCosts.push(this.chartItems()[i].ItemCost);
    }

    var data = {
        labels: chartDates,
        datasets: [
            {
                label: "Costs",
                data: chartCosts
            }
        ],
        options: options
    };

    //options defined for chart
    var options = {
        responsive: true,
        maintainAspectRatio: true
    }

    //blow away the chart if it already exists
    if (myBarChart !== undefined) {
        myBarChart.destroy();
    }

    //create new bar chart using data and options defined above
    myBarChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
};

function AppViewModel() {
    this.budgetItems = ko.observableArray([]);
    this.budgetItemAdd = ko.observable({
        ItemName: ko.observable(),
        ItemDate: ko.observable(),
        ItemCost: ko.observable(),
    });
};

function stripMicrosoftDate(value) {
    var jsonDate = value;  // returns "/Date(1245398693390)/"; 
    //regex to strip out just the integer from the date passed by .NET
    var re = /-?\d+/;
    var m = re.exec(jsonDate);
    var d = new Date(parseInt(m[0]));
    return d;
};

function populateData() {
    populateTable(); //populate the table with item data
    populateChart(); //refresh the chart data / init chart
}

$(document).ready(function () {
    ko.applyBindings(viewModel);
    populateData();
    //toggle hidden divs
    docReadyToggles();

    $("[id$=txtDate]").datepicker({
        autoclose: true,
        todayHighlight: true
    });

    $("[id$=tblDate]").datepicker({
        autoclose: true,
        todayHighlight: true
    });
});
