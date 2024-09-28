import React from "react";
import AddSalary from "./AddSalary";
import Search from "./Search";  
import ViewSalary from "./ViewSalary";

const Salary = () => {
    return (
        <div className="h-full">
            <AddSalary />
            <ViewSalary />
        </div>
    );
}

export default Salary;
