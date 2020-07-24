const Employee = require("./Employee");

class Manager extends Employee {
    constructor(name, id, email, officeNo) {
        super(name, id, email);
        this.officeNo = officeNo;
    }

    getOfficeNo() {
return this.officeNo;
    }

    getRole() {
        return "Manager";
    }

}

module.exports = Manager;