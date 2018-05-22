function PunchGroup(previousClockIn, clockIn, clockOut) {
    var self = this;
    self.clockIn = clockIn;
    self.clockOut = clockOut;
    self.previousClockIn = previousClockIn ? previousClockIn : ko.observable('');

    self.convertToDate = function (timeString) {
        return new Date('1/1/2001 ' + timeString);
    };

    self.clockInValid = ko.pureComputed(
        function () {
            var clockInDate = self.convertToDate(self.clockIn());
            var clockOutDate = self.convertToDate(self.clockOut());
            var previousClockInDate = self.convertToDate(self.previousClockIn());
            if (isNaN(clockOutDate)) {
                return true;
            }
            var previousClockInValid = previousClockIn ? previousClockInDate <= clockInDate : true;
            var isAllValid = !isNaN(clockInDate) && previousClockInValid && clockInDate <= clockOutDate
            return isAllValid;
        }
    );

    self.clockOutValid = ko.pureComputed(
        function () {
            var clockInDate = self.convertToDate(self.clockIn());
            var clockOutDate = self.convertToDate(self.clockOut());
            return !isNaN(clockOutDate) && clockInDate <= clockOutDate;
        }
    )

    self.invalidTimeMessage = ko.pureComputed(function () {
        return "Invalid Time: ClockIn must be > ClockOut."
    });

    self.focusTextBox = function (id) {
        event.stopPropagation();
        $('#' + id).focus().trigger('click');
    }
}