function AppViewModel() {
    var self = this;
    self.oneDayOnly = ko.observable(true);
    self.weekdayArray = ko.observableArray([]);

    self.setUpWeekDayArray = function () {
        var dayArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        self.weekdayArray([]);
        if (self.oneDayOnly()) {
            var dayToAdd = new Day();
            dayToAdd.weekdayName = 'Today';
            self.weekdayArray.push(dayToAdd);
        } else {
            for (var i = 0; i < 7; i++) {
                var dayToAdd = new Day();
                dayToAdd.weekdayName(dayArray[i]);
                self.weekdayArray.push(dayToAdd);
            }
        }
    }

    self.setUpWeekDayArray();
    self.oneDayOnly.subscribe(self.setUpWeekDayArray);

    self.calculateHHMMSS = function (msec) {
        var hh = Math.floor(msec / 1000 / 60 / 60); //convert milliseconds to hrs
        msec -= hh * 1000 * 60 * 60;                //subtract the hours from milliseconds
        var mm = Math.floor(msec / 1000 / 60);      //convert the remainder from the hours conversion to minutes
        msec -= mm * 1000 * 60;                     //subtract minutes from the calculation
        var ss = Math.floor(msec / 1000);           //convert the remainder to seconds
        return { hours: hh, minutes: mm, seconds: ss };
    }

    self.totalHours = ko.computed(function () {
        var total = 0;
        var isValid = true;
        for (var i = 0; i < self.weekdayArray().length; i++) {
            total += self.weekdayArray()[i].totalSeconds();
            isValid = self.weekdayArray()[i].isValid();
            if (!isValid) {
                total = -1;
                break;
            }
        }

        var timeObj = self.calculateHHMMSS(total);


        if (!isValid || isNaN(total) || total < 0) {
            return "Invalid time was set. Please make sure your hours are correct.";
        }

        return timeObj.hours + " hrs " + timeObj.minutes + " minutes " + timeObj.seconds + " seconds.";
    });

    self.parrotVisible = ko.observable(false);
    self.toggleParrotVisible = function(){
        self.parrotVisible(!self.parrotVisible());
    }
}

$(function () {
    var appViewModel = new AppViewModel();
    ko.applyBindings(appViewModel);
    $('.clockpicker').clockpicker(
        {
            placement: 'right',
            align: 'top',
            twelvehour: false,
            autoclose: true,
            doneText: 'Done'
        }
    );

    $(":input").inputmask("datetime",
        { inputFormat: "HH:MM"}
    );
});