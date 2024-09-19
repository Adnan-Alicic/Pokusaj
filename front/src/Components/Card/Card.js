import React from "react";
import './Card.css';
import { BrowserView, MobileView } from "react-device-detect";
import EditTask from "../Edit-Task/Edit-Task";

function CardComponent({ task }) {
    if (!task) {
        return <div>Loading...</div>; // Ili prikaži neku poruku ili placeholder dok se task ne učita
    }

    return (
        <div className="card-container">
            <div className="task-bin">
                <h3 style={{textAlign:"center", marginTop:"3%"}}>{task.naziv_taska}</h3>
                <button id="delete-task"><img style={{width:"100%", height:"100%"}} src="bin.png" alt="SarajevoGas Logo"></img></button>
            </div>
            <p id="task-description-p">{task.tekst_taska}</p>
            <div className="card-footer">
                <div className="card-status-div">
                    <p id='card-task-priority'>{task.prioritet}</p>
                    <p id="card-task-assigned">{task.worker_name}</p>
                </div>
                <div className="card-status-div">
                    <p id="card-status-caption">Status:</p>
                    <select id="task-progress-select" value={task.status} required>
                        <option value="U toku">U toku</option>
                        <option value="Završeno">Završeno</option>
                    </select>
                </div>
                <EditTask task={task} />
            </div>
        </div>
    );
}



export default CardComponent;