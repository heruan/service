function Customer(customer) {
    this.name = ko.observable(customer.name);
}

function User(contact) {
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
    this.tags = ko.observableArray();
    this.notes = ko.observableArray();

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
        return time / max * 100;
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
        return time / max * 100;
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
        return time / max * 100;
    };

    this.update = function(ticket) {
        this.number(ticket.number);
        this.status(ticket.status);
        this.severity(ticket.severity);
        this.customer(new Customer(ticket.customer));
        this.contact(new User(ticket.contact));
        this.responseTime(ticket.responseTime);
        this.interventionTime(ticket.interventionTime);
        this.resolutionTime(ticket.resolutionTime);
        this.tags(ticket.tags);
        this.notes(ticket.notes);

        switch (ticket.status) {
            case 0:
                setInterval(function (self) {
                    var time = self.responseTime();
                    self.responseTime(++time);
                }, 1000, this);
                break;
            case 1:
                setInterval(function (self) {
                    var time = self.interventionTime();
                    self.interventionTime(++time);
                }, 1000, this);
                break;
            case 3:
                setInterval(function (self) {
                    var time = self.resolutionTime();
                    self.resolutionTime(++time);
                }, 1000, this);
                break;
        }
    };

    this.update(ticket);
}

var lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel ultrices ligula. Phasellus vestibulum fringilla ipsum nec imperdiet. Duis id accumsan erat. Vestibulum neque purus, faucibus id sagittis ut, dictum quis purus. Phasellus non nibh mollis, ullamcorper elit eu, dignissim lorem. Mauris tincidunt leo non lorem ornare, eu vehicula lacus viverra.';

var _ticket = {
    number : '201308270001',
    status : 0,
    severity : 0,
    customer : {
        name : 'Fiera di Vicenza'
    },
    contact : {
        cn : 'Sergio Casagrande',
    },
    responseTime : 465,
    interventionTime : 3600,
    resolutionTime: 28800,
    tags : [ 'foo', 'bar', 'baz' ],
    notes : [
        {
            author : {
                cn : 'Sergio Casagrande'
            },
            created : '2013-08-27T17:28',
            public : true,
            via : 'web',
            text : lipsum,
            attachments : [],
            previousStatus : null,
            currentStatus : 0,
            previousAssignee : null,
            currentAssignee : null
        },
        {
            author : {
                cn : 'Luca Marchioron'
            },
            created : '2013-08-27T17:36',
            public : true,
            via : 'web',
            text : '',
            attachments : [],
            previousStatus : 0,
            currentStatus : 1,
            previousAssignee : null,
            currentAssignee : {
                cn : 'Giovanni Lovato'
            }
        },
        {
            author : {
                cn : 'Giovanni Lovato'
            },
            created : '2013-08-27T18:36',
            public : false,
            via : 'web',
            text : lipsum,
            attachments : [
                {
                    name : 'Manual.pdf',
                    type : 'PDF',
                    size : '1.5 MB'
                },
                {
                    name : 'configuration.xml',
                    type : 'XML',
                    size : '86 KB'
                }
            ],
            previousStatus : 1,
            currentStatus : 2,
            previousAssignee : {
                cn : 'Giovanni Lovato'
            },
            currentAssignee : {
                cn : 'Lorenzo Di Pace'
            }
        }

    ]
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
