const Employee = require("./Employee")
// Create Manager object constructor inherit from Employee
class Manager extends Employee {
    constructor(name, id, email, officeNumber) {
        super(name, id, email, "Manager");
        this.officeNumber = officeNumber;
    }

    getOfficeNumber() {
        return this.officeNumber;
    }
  }
  
  module.exports = Manager;