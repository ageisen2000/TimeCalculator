function Day() {
    var self = this;
    self.weekdayName = ko.observable();
    self.clockInMorning = ko.observable('08:00');
    self.clockOutMorning = ko.observable('12:00');
    self.clockInEvening = ko.observable('12:30');
    self.clockOutEvening = ko.observable('16:30');

    self.morningDate = ko.computed(function(){return new Date('1/1/2001 ' + this.clockInMorning())},this);
    self.morningDate2 = ko.computed(function(){return new Date('1/1/2001 ' + this.clockOutMorning())},this);
    self.eveningDate = ko.computed(function(){return new Date('1/1/2001 ' + this.clockInEvening())},this);
    self.eveningDate2 = ko.computed(function(){return new Date('1/1/2001 ' + this.clockOutEvening())},this);

    self.totalSeconds = ko.computed(function () {
        return (self.morningDate2() - self.morningDate()) + (self.eveningDate2() - self.eveningDate());
    });

    self.isValidDates = ko.computed(function(){
        return !(
        (isNaN(Date.parse(self.morningDate2())) == true) ||
        (isNaN(Date.parse(self.morningDate())) == true) ||
        (isNaN(Date.parse(self.eveningDate2())) == true) ||
        (isNaN(Date.parse(self.eveningDate())) == true));
    });

    self.isValidMorning = ko.computed(function(){
        return self.morningDate2() >= self.morningDate() && self.isValidDates();
    });

    self.isValidEvening = ko.computed(function(){
        return self.isValidDates() && ((self.eveningDate2() >= self.eveningDate()) &&
            (self.morningDate2() <= self.eveningDate())
            && self.totalSeconds() >= 0);
    });
}
