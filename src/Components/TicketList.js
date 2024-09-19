import React, { useState, useEffect } from 'react';

const TicketList = ({ workerId }) => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`http://localhost:3000/tickets/worker/${workerId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setTickets(data);
                } else {
                    console.error('Greška prilikom preuzimanja tiketa:', data.message);
                }
            } catch (error) {
                console.error('Greška:', error);
            }
        };

        fetchTickets();
    }, [workerId]);

    return (
        <div>
            <h2>Lista Tiketa</h2>
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket.id}>
                        <h3>{ticket.title}</h3>
                        <p>{ticket.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TicketList;
