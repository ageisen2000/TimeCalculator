function AppViewModel() {
    var self = this;
    self.weekdayArray = ko.observableArray([]);
    var dayArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (var i = 0; i < 7; i++) {
        var dayToAdd = new Day();
        dayToAdd.weekdayName(dayArray[i]);
        self.weekdayArray.push(dayToAdd);
    }
    self.isAllValid = ko.computed(function(){
        for (var i = 0; i < self.weekdayArray().length; i++){
            if(!(self.weekdayArray()[i].isValidMorning() && self.weekdayArray()[i].isValidEvening())){
                return false;
            }
        }
        return true;
    });
    self.totalHours = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < self.weekdayArray().length; i++) {
            total += self.weekdayArray()[i].totalSeconds();
        }

        var msec = total;
        var hh = Math.floor(msec / 1000 / 60 / 60); //convert milliseconds to hrs
        msec -= hh * 1000 * 60 * 60;                //subtract the hours from milliseconds
        var mm = Math.floor(msec / 1000 / 60);      //convert the remainder from the hours conversion to minutes
        msec -= mm * 1000 * 60;                     //subtract minutes from the calculation
        var ss = Math.floor(msec / 1000);           //convert the remainder to seconds

        if (total < 0 || !self.isAllValid()) {
            return "Invalid time was set. Please make sure your hours are correct.";
        }

        return hh + " hrs " + mm + " minutes " + ss + " seconds.";
    });
}

$(function() {
    var appViewModel = new AppViewModel();
    ko.applyBindings(appViewModel);
    $('.clockpicker').clockpicker('twelvehour');
});

