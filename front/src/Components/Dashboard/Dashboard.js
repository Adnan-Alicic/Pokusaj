import './Dashboard.css';
import { Button } from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import CardComponent from '../Card/Card';
import { useState, useEffect } from 'react';
import { BrowserView, MobileView } from "react-device-detect";
import AddEditTask from '../Add-Edit-Task/Add-Edit-Task';
import ReportIssue from '../Report-Issue/Report-Issue';
// Uklonili smo Slider i sve njegove dependencije
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

function DashBoard() {
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]); 
    const [complaints, setComplaints] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [loadingComplaints, setLoadingComplaints] = useState(true);
    const [user, setUser] = useState({ firstname: '', lastname: '', sector: '' }); // Korisnički podaci
    const [workers, setWorkers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const tasksPerPage = 3; // Number of tasks per page

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);
        if (userRole !== 'Sector Manager' && userRole !== 'User') {
            navigate('/index');
        }
        const userData = JSON.parse(localStorage.getItem('userData')); // Pretpostavimo da je ulogovani korisnik sačuvan
        console.log("Korisnički podaci iz localStorage:", userData);
        if (userData) {
            setUser(userData); // Postavi ime, prezime i sektor
        }

    }, [navigate]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tasks/all-tasks', { 
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
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

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/report-issue/all-complaints', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setComplaints(data.complaints || []); 
            } catch (error) {
                console.error('Greška prilikom preuzimanja prijava smetnji:', error);
            } finally {
                setLoadingComplaints(false); // Postavi loading na false nakon preuzimanja podataka
            }
        };
        fetchComplaints();
    }, []);

    // Sortiranje taskova prvo po ovjeri, zatim po statusu i prioritetu
    const sortedTasks = tasks.sort((a, b) => {
        if (a.verifikacija !== b.verifikacija) {
            return a.verifikacija ? 1 : -1;
        }
        if (a.status !== b.status) {
            return a.status === 'U toku' ? 1 : -1;
        }
        const priorities = ['Urgentno', 'Visoki', 'Srednji', 'Niski'];
        return priorities.indexOf(a.prioritet) - priorities.indexOf(b.prioritet);
    });

    // Logic for displaying tasks per page
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Total number of pages
    const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

    const handleCreateTask = (complaint) => {
        setSelectedComplaint(complaint);
        setModalOpen(true);
    };

    const onTaskCreated = async (complaintId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/report-issue/create-task/${complaintId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setComplaints(complaints.filter(c => c.id !== complaintId));
                alert('Task je uspješno kreiran i prijava smetnji je ažurirana!');
            } else {
                alert('Došlo je do greške prilikom kreiranja taska.');
            }
        } catch (error) {
            console.error('Greška prilikom kreiranja taska:', error);
            alert('Došlo je do greške prilikom slanja taska.');
        }
    };

    const handleVerifyTask = async (task) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/verify-task/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Task je uspješno ovjeren!');
                setComplaints(complaints.filter(c => c.id !== task.prijavaSmetnjiId));
            } else {
                alert('Došlo je do greške prilikom ovjere taska.');
            }
        } catch (error) {
            console.error('Greška prilikom ovjere taska:', error);
        }
    };


    return (
        <>
            <BrowserView>
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
                        <h2 style={{ textAlign: "center", color: "#224798" }}>Dobrodošao, {user.firstname} {user.lastname} ({user.sector})</h2>
                    </div>

                    <div className='task-heading'>
                        <h3 style={{ margin: "10px 0px 0px 16%", color: "#224798" }}>Taskovi </h3>
                        <Button onClick={() => setModalOpen(true)} className='button-add' size="lg" tag={Link}>
                            <img style={{width:"25%", height:"100%"}} src="Plus-icon.png" alt="SarajevoGas Logo" />
                        </Button>
                    </div>
                    

                    <div className='task-list'>
                        {currentTasks.length > 0 ? (
                            currentTasks.map(task => (
                                <div key={task.id} className='task-item'>
                                    <h3>{task.naziv_taska}</h3>
                                    <p>{task.tekst_taska}</p>
                                    <p><strong>Prioritet:</strong> {task.prioritet}</p>
                                    <p><strong>Radnik:</strong> {task.User ? `${task.User.firstname} ${task.User.lastname}` : 'N/A'}</p>
                                    <p><strong>Status:</strong> {task.status}</p>
                                    <p><strong>Verifikacija:</strong> {task.verifikacija ? 'Ovjereno' : 'Nije ovjereno'}</p>

                                    {task.status === 'Završeno' && !task.verifikacija && (
                                    <Button className='btn-ovjera'
                                        onClick={async () => {
                                            const response = await fetch(`http://localhost:3000/api/tasks/verify-task/${task.id}`, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                            });

                                            if (response.ok) {
                                                alert('Task je uspješno ovjeren!');
                                                setTasks(tasks.map(t => t.id === task.id ? { ...t, verifikacija: true } : t));
                                            } else {
                                                alert('Došlo je do greške prilikom verifikacije taska.');
                                            }
                                        }}
                                    >
                                        Ovjeri
                                    </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Nema taskova za prikaz.</p>
                        )}
                    </div>

                    
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

                    <div className='task-heading'>
                        <h3 style={{ margin: "10px 0px 0px 16%", color: "#ff0808" }}>Prijave </h3>

                    </div>

                    

                    <div className='complaints-list'>
    {loadingComplaints ? (
        <p>Loading prijave smetnji...</p>
    ) : complaints.length > 0 ? (
        complaints
            .sort((a, b) => a.hasTask - b.hasTask) 
            .map(complaint => (
                <div key={complaint.id} className='complaint-item'>
                    <h3>{complaint.opis}</h3>
                    <p><strong>Sektor:</strong> {complaint.sektor}</p>
                    <p><strong>Ime:</strong> {complaint.ime}</p>
                    <p><strong>Email:</strong> {complaint.email}</p>
                    {complaint.hasTask ? (
                        <p style={{ color: 'green' }}>Task kreiran</p>
                    ) : (
                        <Button onClick={() => handleCreateTask(complaint)}>Kreiraj Task</Button>
                    )}
                </div>
            ))
    ) : (
        <p>Nema prijava smetnji za prikaz.</p>
    )}
</div>



                    {role === 'Sector Manager' && (
                        <div className='footer-div'>
                            <ReportIssue />
                        </div>
                    )}
                </div>
            </BrowserView>

            <MobileView>
                <div className='body-dashboard'>
                    <div className='image-div'>
                        <img style={{ width: "50%", height: "100%" }} src="SarajevogasLogo2.jpg" alt="SarajevoGas Logo"></img>
                    </div>

                    <div className='heading-div' style={{ height: "5%" }}>
                        <h3 style={{ textAlign: "center", margin: "0" }}>Helpdesk</h3>
                    </div>

                    <div className='greeting-message-div'>
                        <h3 style={{ textAlign: "center", margin: "0", color: "#224798" }}>Dobro došli</h3>
                    </div>

                    <div className='task-heading' style={{ textAlign: "center", justifyContent: "center" }}>
                        <h3 style={{ margin: "0", color: "#224798" }}>Taskovi</h3>
                        {role === 'Sector Manager' && <AddEditTask />}
                    </div>

                    <div className='card-div'>
                        <CardComponent />
                    </div>

                    {role === 'Sector Manager' && <ReportIssue />}
                </div>
            </MobileView>

            {/* Modal za kreiranje taska */}
            {modalOpen && (
                <AddEditTask
                    isOpen={modalOpen}
                    toggle={() => setModalOpen(false)}
                    defaultData={selectedComplaint ? {
                        sektor: selectedComplaint.sektor,
                        opis: selectedComplaint.opis,
                        prijavaId: selectedComplaint.id
                    } : {
                        sektor: user.sector,  // Koristi sektor ulogovanog korisnika kada nema prijave
                        opis: '',  // Prazan opis kada nema prijave
                        prijavaId: null  // Nema prijave smetnje
                    }}
                    workers={workers}  // Prosljeđivanje radnika u modal
                    onTaskCreated={() => {
                        // Ažuriranje prijava, samo ako postoji selectedComplaint
                        if (selectedComplaint) {
                            setComplaints(complaints => complaints.map(c => 
                                c.id === selectedComplaint.id ? { ...c, hasTask: true } : c
                            ));
                        }
                        setModalOpen(false);
                    }}
                />
            )}

        </>
    );
}

export default DashBoard;
