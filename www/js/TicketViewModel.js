
function Customer(customer) {
    this.name = ko.observable(customer.name);
}

function Contact(contact) {
    this.cn = ko.observable(contact.cn);
    this.mail = ko.observableArray(contact.mail);
}

function Ticket(ticket) {
    this.number = ko.observable();
    this.status = ko.observable();
    this.severity = ko.observable();
    this.customer = ko.observable();
    this.contact = ko.observable();
    this.responseTime = ko.observable();
    this.interventionTime = ko.observable();
    this.resolutionTime = ko.observable();

    this.timeString = function(time) {
        if (time < 60) {
            return time + ' s';
        }
        else if (time >= 60 && time < 3600) {
            return Math.floor(time / 60) + ' m';
        }
        else if (time >= 3600 && time < 86400) {
            return Math.floor(time / 60 / 60) + ' h';
        }
        else {
            return Math.floor(time / 60 / 60 / 24) + ' d';
        }
    };

    this.responseProgress = function(time) {
        var max = 0;
        switch (parseInt(this.severity())) {
            default:
                max = 3600 / 2;
        }
        if (time >= max) {
            return 100;
        }
        return Math.floor(time / max * 100);
    };

    this.interventionProgress = function(time) {
        var max = 0;
        switch (parseInt(this.severity())) {
            case 2:
                max = 3600 * 2;
                break;
            default:
                max = 3600 * 8;
        }
        if (time >= max) {
            return 100;
        }
        return Math.floor(time / max * 100);
    };

    this.resolutionProgress = function(time) {
        var max = 0;
        switch (parseInt(this.severity())) {
            case 2:
                max = 3600 * 4;
                break;
            default:
                max = 3600 * 48;
        }
        if (time >= max) {
            return 100;
        }
        return Math.floor(time / max * 100);
    };

    this.update = function(ticket) {
        this.number(ticket.number);
        this.status(ticket.status);
        this.severity(ticket.severity);
        this.customer(new Customer(ticket.customer));
        this.contact(new Contact(ticket.contact));
        this.responseTime(ticket.responseTime);
        this.interventionTime(ticket.interventionTime);
        this.resolutionTime(ticket.resolutionTime);
    };

    this.update(ticket);
}

var _ticket = {
    number : '201308270001',
    status : 2,
    severity : 0,
    customer : {
        name : 'Fiera di Vicenza'
    },
    contact : {
        cn : 'Sergio Casagrande',
    },
    responseTime : 465,
    interventionTime : 3600,
    resolutionTime: 28800
};

var _ticket2 = {
    number : '201308270002',
    status : 1,
    severity : 2,
    customer : {
        name : 'Finiper'
    },
    contact : {
        cn : 'Giovanni Oteri',
    },
    responseTime : 645,
    interventionTime : 4365,
    resolutionTime: 215
};
