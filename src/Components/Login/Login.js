import React, { useState } from "react";
import './Login.css';
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Ovdje sprječavamo defaultno ponašanje
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log('Server odgovor:', data);
        
            if (response.ok) {
                localStorage.setItem('token', data.token); // Sačuvajte token
                localStorage.setItem('userRole', data.user.role); // Sačuvajte ulogu korisnika
                localStorage.setItem('userId', data.user.id);  // Ispravno postavljanje userId
                console.log('Sačuvan korisnički ID:', localStorage.getItem('userId'));

                // Dodajemo spremanje sektora u localStorage
                const userSector = data.user.sector || 'Sektor 1'; // Primjer ručnog postavljanja
                localStorage.setItem('userSector', userSector);
                console.log('Sačuvan sektor:', userSector);

                if (data.redirect) {
                    console.log('Redirekcija na:', data.redirect);
                    navigate(data.redirect);  // Proverite vrednost `data.redirect`
                } else {
                    console.error('Nema postavljenog redirect URL-a');
                }
            } else {
                setErrorMessage(data.message);
                alert(`Greška: ${data.message}`);
            }
        } catch (error) {
            console.error('Greška prilikom prijave:', error);
        }
    };

    // Definicija handleKeyDown funkcije
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleLogin(event); 
        }
    };

    return (
        <>
            <BrowserView>
                <div className="background">
                    <div className="container">
                        <div className="left-side">
                            <div className="logo-container">
                                <div className="logo-container-sc">
                                    <img src="logo_samo.png" alt="SarajevoGas Logo" className="logo" />
                                </div>
                                <h2>SarajevoGas HelpDesk</h2>
                            </div>
                        </div>
                        <div className="right-side">
                            <div className="login-box">
                                <h2 style={{ color: "#224798", textAlign: "center" }}>Login</h2>
                                {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
                                <form className="form" onSubmit={handleLogin}> {/* Ovdje koristimo onSubmit */}
                                    <label style={{ color: "#224798" }} htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="ime.prezime@sarajevogas.ba"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <label style={{ color: "#224798" }} htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Unesi svoj password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Button
                                        style={{ textAlign: "center", textDecoration: "none" }}
                                        className='button'
                                        size="lg"
                                        type="submit" // Dodajemo type="submit" da radi sa onSubmit
                                    >
                                        Login
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserView>
            <MobileView>
                <div className='login-body-mobile'>
                    <div className='image-div'>
                        <img style={{ width: "25%", height: "100%" }} src="logo_samo.png" alt="SarajevoGas Logo" />
                    </div>
                    <div className='heading-div'>
                        <h2 style={{ textAlign: "center", margin: "0" }}>Sarajevogas Helpdesk</h2>
                    </div>
                    <h2 style={{ color: "#224798", textAlign: "center" }}>Login</h2>
                    {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
                    <form className="form-mobile" onSubmit={handleLogin}>
                        <label style={{ color: "#224798" }} htmlFor="email">Email</label>
                        <input
                            style={{ width: "50%" }}
                            type="email"
                            id="email"
                            placeholder="ime.prezime@sarajevogas.ba"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <label style={{ color: "#224798" }} htmlFor="password">Password</label>
                        <input
                            style={{ width: "50%" }}
                            type="password"
                            id="password"
                            placeholder="Unesi svoj password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button
                            style={{ textAlign: "center", textDecoration: "none", width: "50%" }}
                            className='button-mobile'
                            size="lg"
                            type="submit"
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </MobileView>
        </>
    );
}

export default Login;
