import './WorkerDash.css';
import { useState, useEffect } from 'react';
import { Button } from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import ReportIssue from '../Report-Issue/Report-Issue';

function WorkerDash() {
    const [tasks, setTasks] = useState([]); 
    const [role, setRole] = useState('');  // Dodano za setRole
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const tasksPerPage = 3; // Display 3 tasks per page
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);

        if (userRole !== 'User') {
            navigate('/'); // Ako korisnik nije radnik, preusmeri ga
        }
    }, [navigate]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/tasks/worker-tasks', { 
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Greška prilikom preuzimanja taskova:', error);
            }
        };

        fetchTasks(); 
    }, []);

    // Logic for displaying tasks per page
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Total number of pages
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    return (
        <>
            <div className='body-dashboard'>
                <div className='image-div'>
                    <img style={{ height: "100%", marginTop: "5px" }} src="SarajevogasLogo2.jpg" alt="SarajevoGas Logo"></img>
                </div>

                <div className='heading-div'>
                    <h2 id='h2-ds'>Helpdesk</h2>
                    <Button style={{ textAlign: "center", textDecoration: "none", width: "10%" }} className='button-logout' to="/index"
                        size="lg"
                        tag={Link}>Logout</Button>
                </div>

                <div className='greeting-message-div'>
                    <h2 style={{ textAlign: "center", margin: "0", color: "#224798" }}>Dobrodošao, korisnik</h2>
                </div>

                <div className='task-heading'>
                    <h3 style={{ margin: "10px 0px 0px 16%", color: "#224798" }}>Moji Taskovi</h3>
                </div>

                <div className='task-list'>
                    {currentTasks.length > 0 ? (
                        currentTasks.map(task => (
                            <div key={task.id} className='task-item'>
                                <h3>{task.naziv_taska}</h3>
                                <p>{task.tekst_taska}</p>
                                <p><strong>Prioritet:</strong> {task.prioritet}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                                <Button className='btn-done'
                                    onClick={async () => {
                                        const response = await fetch(`http://localhost:3000/api/tasks/complete-task/${task.id}`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                        });

                                        if (response.ok) {
                                            alert('Task je uspješno završen!');
                                            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'Završeno' } : t));
                                        } else {
                                            const errorMessage = await response.json();
                                            alert('Došlo je do greške prilikom završavanja taska.');
                                        }
                                    }}
                                >
                                    DONE
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p>Nema taskova za prikaz.</p>
                    )}
                </div>

                {role === 'User' && (
                    <div className='footer-div'>
                        <ReportIssue />
                    </div>
                )}

                {/* Pagination */}
                <div className="pagination">
                    {[...Array(totalPages).keys()].map((page) => (
                        <Button
                            key={page + 1}
                            onClick={() => paginate(page + 1)}
                            className={currentPage === page + 1 ? 'active' : ''}
                        >
                            {page + 1}
                        </Button>
                    ))}
                </div>

                
            </div>
        </>
    );
}

export default WorkerDash;
