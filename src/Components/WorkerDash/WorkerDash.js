import './WorkerDash.css';
import { useState, useEffect } from 'react';
import { Button } from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import { BrowserView, MobileView } from "react-device-detect";
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
                position: 'absolute',  // Ensure it's positioned over the slider
                top: '50%',  // Vertically centered
                right: '0px',  // Positioned at the right edge
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
                position: 'absolute',  // Ensure it's positioned over the slider
                top: '50%',  // Vertically centered
                left: '0px',  // Positioned at the left edge
                transform: 'translateY(-50%)'
            }}
            onClick={onClick}
        />
    );
}

function WorkerDash() {
    const [tasks, setTasks] = useState([]); 
    const [role, setRole] = useState('');  // Dodano za setRole
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
            console.log('Dohvaćeni taskovi:', data); // Dodaj ovaj red za proveru
            setTasks(data);
        } catch (error) {
            console.error('Greška prilikom preuzimanja taskova:', error);
        }
    };

    fetchTasks(); 
}, []);

     // Ensure tasks is an array before sorting
    const sortedTasks = Array.isArray(tasks) ? tasks.sort((a, b) => {
        if (a.status === 'U toku' && b.status !== 'U toku') return -1; // Tasks in progress come first
        if (a.status !== 'U toku' && b.status === 'U toku') return 1; // Completed tasks come after
        return a.prioritet.localeCompare(b.prioritet); // Then sort by priority
    }) : []


    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: Math.min(tasks.length, 3),
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

                    <div>
                        <h1>Taskovi</h1>
                        <div className='task-slider'>
                            {tasks.length > 0 ? (
                                <Slider {...sliderSettings}>
                                    {tasks.map(task => (
                                        <div key={task.id} className='task-item'>
                                            <h3>{task.naziv_taska}</h3>
                                            <p>{task.tekst_taska}</p>
                                            <p><strong>Prioritet:</strong> {task.prioritet}</p>
                                            <p><strong>Status:</strong> {task.status}</p>
                                            <Button
                                                onClick={async () => {
                                                    console.log(`Pokušaj završavanja taska sa ID: ${task.id}`); // Provjeri ID taska prije slanja

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
                                                        const errorMessage = await response.json(); // Očitaj grešku sa servera
                                                        console.log('Greška sa servera:', errorMessage);
                                                        alert('Došlo je do greške prilikom završavanja taska.');
                                                    }
                                                }}
                                            >
                                                DONE
                                            </Button>


                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <p>Nema taskova za prikaz.</p>
                            )}
                        </div>
                    </div>

                    {role === 'User' && (
                        <div className='footer-div'>
                            <ReportIssue />
                        </div>
                    )}
>
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
                        <h3 style={{ margin: "0", color: "#224798" }}>Moji Taskovi</h3>
                    </div>

                    <div className='card-div'>
                        <Button onClick={() => navigate('/report-issue')} className='button-add' size="lg" tag={Link}>
                            Prijavi Smetnju
                        </Button>
                    </div>
                </div>
            </MobileView>
        </>
    );
}

export default WorkerDash;

