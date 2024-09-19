import './Dashboard.css';
import { Button } from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import CardComponent from '../Card/Card';
import { useState, useEffect } from 'react';
import { BrowserView, MobileView } from "react-device-detect";
import AddEditTask from '../Add-Edit-Task/Add-Edit-Task';
import ReportIssue from '../Report-Issue/Report-Issue';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <FaArrowRight
            className={className}
            style={{ 
                ...style, 
                display: 'block', 
                color: 'gray', 
                fontSize: '24px',
                position: 'absolute',
                top: '50%',  
                right: '0px',  
                transform: 'translateY(-50%)'
            }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <FaArrowLeft
            className={className}
            style={{ 
                ...style, 
                display: 'block', 
                color: 'gray', 
                fontSize: '24px',
                position: 'absolute',  
                top: '50%',  
                left: '0px',  
                transform: 'translateY(-50%)'
            }}
            onClick={onClick}
        />
    );
}

function DashBoard() {
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]); 
    const [complaints, setComplaints] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [loadingComplaints, setLoadingComplaints] = useState(true);

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);
        if (userRole !== 'Sector Manager' && userRole !== 'User') {
            navigate('/index');
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
        // Prvo sortiraj po tome da li je task ovjeren ili ne
        if (a.verifikacija !== b.verifikacija) {
            return a.verifikacija ? 1 : -1; // Neovjereni idu prije ovjerenih
        }
        // Zatim sortiraj po statusu: "U toku" ide ispred "Završeno"
        if (a.status !== b.status) {
            return a.status === 'U toku' ? 1 : -1;
        }
        // Ako je status isti, sortiraj po prioritetu: Urgentno, Visoki, Srednji, Niski
        const priorities = ['Urgentno', 'Visoki', 'Srednji', 'Niski'];
        return priorities.indexOf(a.prioritet) - priorities.indexOf(b.prioritet);
    });

    const handleCreateTask = (complaint) => {
        setSelectedComplaint(complaint);
        setModalOpen(true); // Otvaramo modal ali ne kreiramo task odmah
    };

    // Funkcija koja se poziva nakon što je task stvarno kreiran
    const onTaskCreated = async (complaintId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/report-issue/create-task/${complaintId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setComplaints(complaints.filter(c => c.id !== complaintId)); // Ukloni prijavu s liste
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
      
      // Filtriraj prijave smetnji da ukloniš ovjerene
      setComplaints(complaints.filter(c => c.id !== task.prijavaSmetnjiId));
    } else {
      alert('Došlo je do greške prilikom ovjere taska.');
    }
  } catch (error) {
    console.error('Greška prilikom ovjere taska:', error);
  }
};


    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />, 
        prevArrow: <SamplePrevArrow />, 
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
                        <Button className='button-logout' to="/index" size="lg" tag={Link}>Logout</Button>
                    </div>

                    <div className='greeting-message-div'>
                        <h2 style={{ textAlign: "center", color: "#224798" }}>Dobrodošao, korisnik</h2>
                    </div>

                    <div className='task-heading'>
                        <h3 style={{ margin: "10px 0px 0px 16%", color: "#224798" }}>Taskovi </h3>
                        <Button onClick={() => setModalOpen(true)} className='button-add' size="lg" tag={Link}>
                            <img style={{width:"25%", height:"100%"}} src="Plus-icon.png" alt="SarajevoGas Logo" />
                        </Button>
                    </div>

                    <div className='task-slider'>
                        {tasks.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {tasks.map(task => (
                                    <div key={task.id} className='task-item'>
                                        <h3>{task.naziv_taska}</h3>
                                        <p>{task.tekst_taska}</p>
                                        <p><strong>Prioritet:</strong> {task.prioritet}</p>
                                        <p><strong>Radnik:</strong> {task.User ? `${task.User.firstname} ${task.User.lastname}` : 'N/A'}</p>
                                        <p><strong>Status:</strong> {task.status}</p>
                                        <p><strong>Verifikacija:</strong> {task.verifikacija ? 'Ovjereno' : 'Nije ovjereno'}</p>

                                        {task.status === 'Završeno' && !task.verifikacija && (
                                        <Button
                                            onClick={async () => {
                                                const response = await fetch(`http://localhost:3000/api/tasks/verify-task/${task.id}`, {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                });

                                                if (response.ok) {
                                                    alert('Task je uspješno ovjeren!');
                                                    setTasks(tasks.map(t => t.id === task.id ? { ...t, verifikacija: true } : t)); // Ažuriraj task u stanju
                                                } else {
                                                    alert('Došlo je do greške prilikom verifikacije taska.');
                                                }
                                            }}
                                        >
                                            Ovjeri
                                        </Button>
                                        )}
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p>Nema taskova za prikaz.</p>
                        )}
                    </div>
                    <div>
                        <h2>Prijave Smetnji</h2>
                        <div className='complaints-slider'>
                            {/* Prikaz loading statusa dok se podaci učitavaju */}
                            {loadingComplaints ? (
                                <p>Loading prijave smetnji...</p>
                            ) : complaints.length > 0 ? (
                                <Slider {...sliderSettings}>
                                    {complaints
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
                                        ))}
                                </Slider>
                            ) : (
                                <p>Nema prijava smetnji za prikaz.</p>
                            )}
                        </div>
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
                        prijavaId: selectedComplaint.id // Provjeri da je ID prisutan i točan
                    } : null}
                    onTaskCreated={() => {
                        // Funkcija koja će ažurirati prijave smetnji kada je task uspješno kreiran
                        setComplaints(complaints => complaints.map(c => 
                            c.id === selectedComplaint.id ? { ...c, hasTask: true } : c
                        ));
                        setModalOpen(false); // Zatvaramo modal nakon uspješnog kreiranja taska
                    }}
                />
            )}
        </>
    );
}

export default DashBoard;
