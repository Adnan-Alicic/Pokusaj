import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Form, Input } from 'reactstrap';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({ firstname: '', lastname: '', email: '', password: '', role: '', sector: '' });
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token nije pronađen, preusmeravam na login.');
        navigate('/login');
        return;
    }
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'Admin') {
            navigate('/login');
        } else {
            fetchUsers();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token prije slanja:', token);
            const response = await fetch('http://localhost:3000/admin/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized access. Please log in again.');
                }
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
              // Sortiranje korisnika po abecednom redu imena
        const sortedUsers = data.users.sort((a, b) => a.firstname.localeCompare(b.firstname));
            setUsers(data.users || []);
        } catch (error) {
            console.error('Greška prilikom preuzimanja korisnika:', error);
        }
    };

    const handleCreateUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                fetchUsers(); // Osveži listu korisnika
                setNewUser({ firstname: '', lastname: '', email: '', password: '', role: '', sector: '' });
            } else {
                const errorData = await response.json();
                alert(`Greška prilikom kreiranja korisnika: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Greška prilikom kreiranja korisnika:', error);
        }
    };

    const handleUserUpdate = async (userId) => {
        if (!selectedUser || !selectedUser.firstname || !selectedUser.lastname || !selectedUser.email || !selectedUser.role || !selectedUser.sector) {
            alert('Molimo unesite sva polja.');
            return;
        }

        console.log('Ažuriranje korisnika:', selectedUser); // debg

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstname: selectedUser.firstname,
                    lastname: selectedUser.lastname,
                    email: selectedUser.email,
                    role: selectedUser.role,
                    sector: selectedUser.sector,
                }),
            });

            console.log('Response:', response); // debg

            if (response.ok) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === selectedUser.id ? { ...user, ...selectedUser } : user
                    )
                );
                setSelectedUser(null);
                alert('Podaci korisnika su uspešno ažurirani.');
            } else {
                const errorData = await response.json();
                alert(`Došlo je do greške: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Greška prilikom ažuriranja korisnika:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
    try {
        const token = localStorage.getItem('token'); // Pretpostavljam da token čuvaš u localStorage
        console.log('Token to be sent:', token); // Dodaj log za token

        const response = await fetch(`http://localhost:3000/admin/delete-user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Dodaj token u zaglavlje
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            fetchUsers(); // Osvježi listu korisnika nakon uspješnog brisanja
        } else {
            const errorMsg = await response.json();
            console.error('Greška prilikom brisanja korisnika:', errorMsg);
        }
    } catch (error) {
        console.error('Greška prilikom brisanja korisnika:', error);
    }
};


    const handleUserSelect = (user) => {
        console.log('Selektovan korisnik:', user); // debg
        setSelectedUser(user);
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            <h3>Kreiraj novog korisnika</h3>
            <Form>
                <Input
                    placeholder="Ime"
                    value={newUser.firstname}
                    onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                />
                <Input
                    placeholder="Prezime"
                    value={newUser.lastname}
                    onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                />
                <Input
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <Input
                    placeholder="Lozinka"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <Input
                    type="select"
                    value={newUser.sector}
                    onChange={(e) => setNewUser({ ...newUser, sector: e.target.value })}
                >
                    <option value="" disabled selected>Izaberi sektor</option>
                    <option value="Sektor za projektovanje i podršku korisnicima">Sektor za projektovanje i podršku korisnicima</option>
                    <option value="Sektor za gradnju, pogon i održavanje">Sektor za gradnju, pogon i održavanje</option>
                    <option value="Sektor ekonomike">Sektor ekonomike</option>
                    <option value="Sektor pravnih, kadrovskih i zajedničkih poslova">Sektor pravnih, kadrovskih i zajedničkih poslova</option>
                </Input>
                <Input
                    type="select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="" disabled selected>Izaberi ulogu</option>
                    <option value="User">User</option>
                    <option value="Sector Manager">Sector Manager</option>
                    <option value="Admin">Admin</option>

                </Input>
                <Button onClick={handleCreateUser}>Kreiraj korisnika</Button>
            </Form>

            <h3>Kontrola korisnika</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Email</th>
                        <th>Uloga</th>
                        <th>Sektor</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id} onClick={() => handleUserSelect(user)}>
                                <td>
                                    <Input
                                        value={selectedUser && selectedUser.id === user.id ? selectedUser.firstname : user.firstname}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, firstname: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <Input
                                        value={selectedUser && selectedUser.id === user.id ? selectedUser.lastname : user.lastname}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, lastname: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <Input
                                        value={selectedUser && selectedUser.id === user.id ? selectedUser.email : user.email}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <Input
                                        type="select"
                                        value={selectedUser && selectedUser.id === user.id ? selectedUser.role : user.role}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                    >
                                        <option value="User">User</option>
                                        <option value="Sector Manager">Sector Manager</option>
                                        <option value="Admin">Admin</option>
                                    </Input>
                                </td>
                                <td>
                                    <Input
                                        type="select"
                                        value={selectedUser && selectedUser.id === user.id ? selectedUser.sector : user.sector}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, sector: e.target.value })}
                                    >
                                        <option value="Sektor za projektovanje i podršku korisnicima">Sektor za projektovanje i podršku korisnicima</option>
                                        <option value="Sektor za gradnju, pogon i održavanje">Sektor za gradnju, pogon i održavanje</option>
                                        <option value="Sektor ekonomike">Sektor ekonomike</option>
                                        <option value="Sektor pravnih, kadrovskih i zajedničkih poslova">Sektor pravnih, kadrovskih i zajedničkih poslova</option>
                                    </Input>
                                </td>
                                <td>
                                    <Button onClick={() => handleUserUpdate(user.id)}>Sačuvaj</Button>
                                    <Button onClick={() => handleDeleteUser(user.id)}>Obriši</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Nema korisnika za prikaz.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminDashboard;
