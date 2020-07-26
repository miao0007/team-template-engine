const fs = require("fs");
const inquirer = require("inquirer");
const joi = require("joi");
const Employee = require("./lib/Employee");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");
const render = require("./lib/htmlRenderer");

// General questions for all employee
const employeeQuestions = [{
    type: "input",
    message: "What is team member name: ",
    name: "name",
    validate: validateName
},
{
    type: "number",
    message: "What is the team member ID: ",
    name: "id",
    validate: validateID
},
{
    type: "input",
    message: "And the team member's email address: ",
    name: "email",
    validate: validateEmail
}];

// Specific questions for manager
const managerQuestions = [{
    type: "input",
    message: "What is manager's office number: ",
    name: "officeNum",
    validate: validateName
}];

// Specific questions for engineer
const engineerQuestions = [{
    type: "input",
    message: "The engineer's github link: ",
    name: "github",
    validate: validateName
}];

// Specific questions for intern
const internQuestions = [{
    type: "input",
    message: "What is intern's school: ",
    name: "school",
    validate: validateName
}];



let fullQuestions = [];
const manager = [];
const engineers = [];
const interns = [];

// Gathering information based on employee type and generate objects
function getRole() {
    inquirer.prompt(
        {
            type: "list",
            message: "What type of team member would you like to add?",
            name: "title",
            choices: [
                "Manager",
                "Engineer",
                "Intern",
                "Done"
            ],
            validate: validateTitle
        }

    ).then(function (data) {
        console.log(data.title) 
        if (data.title === "Done") {
            renderHTML();
        }
        else if (data.title === "Manager") {
            fullQuestions = [...employeeQuestions, ...managerQuestions];
            getData(data.title);
        }
        else if (data.title === "Engineer") {
            fullQuestions = [...employeeQuestions, ...engineerQuestions];
            getData(data.title);
        }
        else if (data.title === "Intern") {
            fullQuestions = [...employeeQuestions, ...internQuestions];
            getData(data.title);
        }
    });
}

// Based on employee type, generate different card info
function getData(title) {
    inquirer.prompt(fullQuestions).then(function (data) {
        const { name, id, email, officeNum, github, school } = data;
        switch (title) {
            case "Manager":
                manager.push(new Manager(name, id, email, officeNum));
                break;
            case "Engineer":
                engineers.push(new Engineer(name, id, email, github));
                break;
            case "Intern":
                interns.push(new Intern(name, id, email, school));
                break;
        }
        console.log("-----------------------------------");
        console.log(manager);
        console.log(engineers);
        console.log(interns);
        getRole();
    });

}

// render generated employee information cards into team.html
async function renderHTML(){
    console.log("getting ready to render HTML");
    try {
        const employees = [...manager, ...engineers, ...interns];
        console.log("-----------------------------------");
        console.log(employees)
        const htmlContents = await render(employees);
        fs.writeFile("output/team.html", htmlContents, err => {
            if (err){
                return console.log(err);
            }
            console.log("HTML file created!")
        });
    }
    catch (err) {
        console.log(err);
    }
    
    
};

// handling input data validation
function onValidation(err, val) {
    if (err) {
        console.log(err.message);
        valid = err.message;
    }
    else {
        valid = true;
    }

    return valid;
}
// import Joi module for data validation
function validateTitle(title) {
    return joi.validate(title, joi.array().min(1).required(), onValidation);
}

function validateName(name) {
    return joi.validate(name, joi.string().required(), onValidation);
}

function validateID(id) {
    return joi.validate(id, joi.number().integer().min(1).max(999999).required(), onValidation);
}

function validateEmail(email) {
    return joi.validate(email, joi.string().email({ minDomainSegments: 2 }).required(), onValidation);
}

// back to start
getRole();

