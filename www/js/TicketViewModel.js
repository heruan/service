function Customer(customer) {
    this.name = ko.observable(customer.name);
}

function User(contact) {
    this.cn = ko.observable(contact.cn);
    this.sAMAccountName = ko.observable(contact.sAMAccountName);
    this.mail = ko.observableArray(contact.mail);
}

function Note(note) {
    this.author = ko.observable(new User(note.author));
    this.created = ko.observable(new Date(note.created));
    this.public = ko.observable(note.public);
    this.via = ko.observable(note.via);
    this.viaString = ko.computed(function() {
        switch (this.via().media) {
            case 'web':
                return this.via().media;
            case 'phonecall':
                return [
                    this.via().media,
                    'answered by',
                    this.via().by.cn
                ].join(' ');
        }
    }, this);
    this.text = ko.observable(note.text);
    this.attachments = ko.observableArray(note.attachments);
    this.previousStatus = ko.observable(note.previousStatus);
    this.currentStatus = ko.observable(note.currentStatus);
    this.previousAssignee = ko.observable(note.previousAssignee && new User(note.previousAssignee));
    this.currentAssignee = ko.observable(note.currentAssignee && new User(note.currentAssignee));
}

function Ticket(ticket) {
    this.number = ko.observable();
    this.status = ko.observable();
    this.queue = ko.observable();
    this.type = ko.observable();
    this.severity = ko.observable();
    this.customer = ko.observable();
    this.contact = ko.observable();
    this.assignee = ko.observable();
    this.responseTime = ko.observable();
    this.interventionTime = ko.observable();
    this.resolutionTime = ko.observable();
    this.tags = ko.observableArray();
    this.notes = ko.observableArray();
    this.cc = ko.observableArray();
    this.ccList = ko.computed(function() {
        return $.map(this.cc(), function(cc) {
            return cc.cn();
        }).join(',');
    }, this);

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
        this.queue(ticket.queue);
        this.type(ticket.type);
        this.severity(ticket.severity);
        this.customer(new Customer(ticket.customer));
        this.contact(new User(ticket.contact));
        this.assignee(new User(ticket.assignee));
        this.responseTime(ticket.responseTime);
        this.interventionTime(ticket.interventionTime);
        this.resolutionTime(ticket.resolutionTime);
        this.tags(ticket.tags);
        this.notes($.map(ticket.notes, function(note) {
            return new Note(note);
        }));
        this.cc($.map(ticket.cc, function(user) {
            return new User(user);
        }));

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

var _aro = {
    cn : 'Giovanni Lovato',
    sAMAccountName : 'LovatoG'
};

var _ticket = {
    number : '201308270001',
    status : 2,
    queue : 2,
    type : 0,
    severity : 0,
    customer : {
        name : 'Fiera di Vicenza'
    },
    contact : {
        cn : 'Sergio Casagrande',
    },
    assignee : {
        cn : 'Lorenzo Di Pace',
        sAMAccountName : 'DiPaceL'
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
            via : {
                media : 'phonecall',
                by : {
                    cn : 'Luca Marchioron'
                }
            },
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
            via : {
                media : 'web',
                by : {
                    cn : 'Luca Marchioron'
                }
            },
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
            via : {
                media : 'web',
                by : {
                    cn : 'Giovanni Lovato'
                }
            },
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

    ],
    cc : [
        {
            cn : 'Alessandro Sudiro'
        }
    ]
};

var _ticket2 = {
    number : '201308270002',
    status : 1,
    queue : 1,
    type : 1,
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


