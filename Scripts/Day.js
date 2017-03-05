function Day() {
    this.weekdayName = ko.observable();
    this.clockInMorning = ko.observable('9:00');
    this.clockOutMorning = ko.observable('12:00');
    this.clockInEvening = ko.observable('13:30');
    this.clockOutEvening = ko.observable('17:30');

    this.morningDate = ko.computed(function(){return new Date('1/1/2001 ' + this.clockInMorning())},this);
    this.morningDate2 = ko.computed(function(){return new Date('1/1/2001 ' + this.clockOutMorning())},this);
    this.eveningDate = ko.computed(function(){return new Date('1/1/2001 ' + this.clockInEvening())},this);
    this.eveningDate2 = ko.computed(function(){return new Date('1/1/2001 ' + this.clockOutEvening())},this);

    this.totalSeconds = ko.computed(function () {
        return (this.morningDate2() - this.morningDate()) + (this.eveningDate2() - this.eveningDate());
    }, this);

    this.isValidMorning = ko.computed(function(){
        return this.morningDate2() >= this.morningDate();
    },this);

    this.isValidEvening = ko.computed(function(){
        return (this.eveningDate2() >= this.eveningDate()) &&
            (this.morningDate2() <= this.eveningDate()) &&
            this.totalSeconds() >= 0;
    },this);
}
