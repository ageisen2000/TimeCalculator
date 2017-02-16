function difference(data) {
    var date1 = new Date("1/1/2001 " + data.clockOutEvening());
    var date2 = new Date("1/1/2001 " + data.clockInEvening());
    console.log('date1: ' + date1);
    console.log('date2: ' + date2);
    var diff = Math.abs(date1.getTime() - date2.getTime()) / 3600000;
    console.log('Diff: ' + diff);
    return diff;

}

function Day() {
    this.weekdayName = ko.observable(),
    this.clockInMorning = ko.observable('0:00');
    this.clockOutMorning = ko.observable('0:00');
    this.clockInEvening = ko.observable('0:00');
    this.clockOutEvening = ko.observable('0:00');
    //could break out totalseconds into total hours/mins/seconds and then add those
    //up at the end
    this.totalSeconds = ko.computed(function () {
        var morningDate = new Date("1/1/2001 " + this.clockInMorning());
        var morningDate2 = new Date("1/1/2001 " + this.clockOutMorning());
        var eveningDate = new Date("1/1/2001 " + this.clockInEvening());
        var eveningDate2 = new Date("1/1/2001 " + this.clockOutEvening());

        var diff = (morningDate2 - morningDate) + (eveningDate2 - eveningDate);
        return diff;
    }, this);
}

function AppViewModel() {
    var self = this;

    self.weekdayArray = ko.observableArray([]);
    var dayArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', ]
    for (i = 0; i < 7; i++) {
        var dayToAdd = new Day();
        dayToAdd.weekdayName(dayArray[i]);
        self.weekdayArray.push(dayToAdd);
    };
    self.totalHours = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < self.weekdayArray().length; i++) {
            total += self.weekdayArray()[i].totalSeconds();
        }

        //TODO: possibly fix this....
        var msec = total;
        //convert milliseconds to hrs
        var hh = Math.floor(msec / 1000 / 60 / 60);
        //subtract the hours from milliseconds
        msec -= hh * 1000 * 60 * 60;
        //convert the remainder from the hours conversion to minutes
        var mm = Math.floor(msec / 1000 / 60);
        //subtract minutes from the calculation
        msec -= mm * 1000 * 60;
        //convert the remainder to seconds
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;

        var valueReturn = "";

        if (total < 0) {
            return "Invalid time was set. Please make sure your hours are correct.";
        }

        return hh + " hrs " + mm + " minutes " + ss + " seconds.";

    });

};

var appViewModel = new AppViewModel();
ko.applyBindings(appViewModel);
$('.clockpicker').clockpicker();


