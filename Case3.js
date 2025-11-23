

// ---------- Custom Error ----------
class SalaryError extends Error {
    constructor(message) {
        super(message);
        this.name = "SalaryError";
    }
}
 
// ---------- Employee Class ----------
class Employee {
    constructor(name, baseSalary) {
        const salary = Number(baseSalary); // type conversion
 
        if (isNaN(salary) || salary <= 0) {
            throw new SalaryError("Invalid salary amount");
        }
 
        this.name = name;
        this.baseSalary = salary;
    }
}
 
// ---------- Manager Class (Inheritance) ----------
class Manager extends Employee {
    constructor(name, baseSalary, teamSize) {
        super(name, baseSalary);
        this.teamSize = teamSize;
    }
}
 
// ---------- Bonus Closure ----------
function bonusCalculator(percent) {
    return function (salary) {
        return salary * (percent / 100);
    };
}
 
// 10% bonus function
const tenPercentBonus = bonusCalculator(10);
 
// ---------- Payroll Class ----------
class Payroll {
    constructor(employee) {
        this.employee = employee;
    }
 
    // Arrow function for total calculation
    calculateTotal = (allowances = []) => {
        const totalAllowances = [...allowances].reduce((sum, a) => sum + a, 0); // spread operator
        const bonus = tenPercentBonus(this.employee.baseSalary);
 
        return this.employee.baseSalary + totalAllowances + bonus;
    };
 
    // Simulate monthly salary using setInterval
    startMonthlyPayment() {
        console.log(`Starting monthly salary for ${this.employee.name}...`);
 
        setInterval(() => {
            const amount = this.calculateTotal([1000, 500]); // sample allowances
            console.log(`Salary credited to ${this.employee.name}: ₹${amount}`);
        }, 3000); // every 3 sec = monthly simulation
    }
}
 
