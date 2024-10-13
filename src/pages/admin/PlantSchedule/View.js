import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [columns, setColumns] = useState([]);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        axios.get('/api/plantSchedules')  // Replace with your actual endpoint
        .then(res => {
            setColumns(Object.keys(res.data[0])); // Extract column names from the first record
            setRecords(res.data);  // Store records in state
        })
        .catch(error => {
            console.error("There was an error fetching the data!", error);
        });
    }, []);

    return (
        <div className="container mt-5">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((c, i) => (
                            <th key={i}>{c}</th> 
                        ))}
                        <th>Action</th> 
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, i) => (
                        <tr key={i}>
                            {columns.map((col, j) => (
                                <td key={j}>{record[col]}</td>     
                            ))}
                            <td>UP/Del</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
