function Day() {
    var self = this;
    
    self.clockInTimes = ko.observableArray([]);

    self.initializeClockInTimes = function (){
        self.clockInTimes.push(new PunchGroup(null, ko.observable(''), ko.observable('')));
        self.clockInTimes.push(new PunchGroup(self.clockInTimes()[0].clockOut, ko.observable(''), ko.observable('')));
    }
    self.initializeClockInTimes();

    self.weekdayName = ko.observable();

    self.checkIsValid = function (time) {
        return !isNaN(Date.parse('1/1/2001 ' + time));
    };

    self.convertToDate = function (dateString) {
        return new Date(dateString);
    };

    self.calculateSecondsBetweenTwoTimes = function (timeObj) {
        var seconds = new Date('1/1/2001 ' + timeObj.clockOut()) - new Date('1/1/2001 ' + timeObj.clockIn());
        return seconds > 0 ? seconds : 0;
    };

    self.totalSeconds = ko.computed(function () {
        var totalSeconds = 0;
        self.clockInTimes().forEach(element => {
            totalSeconds += self.calculateSecondsBetweenTwoTimes(element);
        });
        return totalSeconds;
    });

    self.isValid = ko.pureComputed(function () {
        var isValid = true;
        self.clockInTimes().forEach(element => {
            var clockIn = new Date('1/1/2001 ' + element.clockIn());
            var clockOut = new Date('1/1/2001 ' + element.clockOut());
            isValid = isValid && self.checkIsValid(element.clockIn()) && self.checkIsValid(element.clockOut()) && clockIn <= clockOut;
        });
        return isValid;
    });
    
    self.initializeTimePicker = function() {
        $('.clockpicker').clockpicker(
            {
                default: '',
                placement: 'right',
                align: 'top',
                twelvehour: false,
                autoclose: true,
                doneText: 'Done'
            }
        );
    }

    self.addNewTimeGroup = function (data) {
        var lastTime = data.clockInTimes().slice(-1)[0].clockOut;
        lastTime = lastTime == "" ? "" : lastTime;
        var lastTime1 = ko.observable(lastTime());
        var lastTime2 = ko.observable(lastTime());

        data.clockInTimes.push(new PunchGroup(lastTime, lastTime1, lastTime2));
        self.initializeTimePicker();
    };

    self.resetTimeGroup = function (data) {
        data.clockInTimes([]);
        self.initializeClockInTimes();
        self.initializeTimePicker();        
    }
}
