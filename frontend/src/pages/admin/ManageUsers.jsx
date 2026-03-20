import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner, Row, Col } from 'react-bootstrap';
import { Users, User, ShieldCheck, Briefcase, Mail, Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/all'); // Assuming backend has this admin route
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader-container"><span className="loader"></span></div>;

    const getRoleBadge = (role) => {
        if (role === 'admin') return <Badge bg="danger" className="rounded-pill px-3 py-2 bg-opacity-25 text-danger border border-danger border-opacity-10 ls-1">CORE ADMIN</Badge>;
        if (role === 'manager') return <Badge bg="primary" className="rounded-pill px-3 py-2 bg-opacity-25 text-primary border border-primary border-opacity-10 ls-1">PROPERTY EXEC</Badge>;
        return <Badge bg="accent" className="rounded-pill px-3 py-2 bg-opacity-25 text-accent border border-accent border-opacity-10 ls-1">TRAVELER</Badge>;
    };

    return (
        <div className="manage-users-page pb-5 animate-fade-in">
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="animate-slide-up">
                        <Link to="/admin/dashboard" className="text-primary d-flex align-items-center gap-2 mb-3 text-decoration-none fw-bold small ls-1">
                            <ArrowLeft size={16} /> BACK TO COMMAND
                        </Link>
                        <h2 className="display-6 fw-900 gradient-text mb-0">User Identity Hub</h2>
                        <p className="text-secondary opacity-75 mt-2 fw-bold d-flex align-items-center gap-2">
                           <Activity size={14} className="text-danger" /> Auditing registered platform participants.
                        </p>
                    </div>
                </div>

                <div className="glass-card overflow-hidden shadow-2xl animate-slide-up-delay">
                    <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-white border-opacity-5 bg-white bg-opacity-5">
                        <h5 className="fw-900 mb-0 text-white ls-tight d-flex align-items-center gap-2">
                             <Users size={20} className="text-danger" /> Platform Registry
                        </h5>
                        <Badge bg="white" className="bg-opacity-10 text-secondary ls-1 px-3 py-2 small fw-bold">TOTAL ACCOUNTS: {users.length}</Badge>
                    </div>
                    <div className="table-responsive">
                        <Table hover variant="dark" className="m-0 align-middle" style={{ background: 'transparent' }}>
                            <thead className="bg-white bg-opacity-5">
                                <tr>
                                    <th className="py-4 ps-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Identity & Sector</th>
                                    <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Contact Auth</th>
                                    <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Access Level</th>
                                    <th className="py-4 pe-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-end">Integrity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-bottom border-white border-opacity-5 transition-all">
                                        <td className="py-4 ps-4">
                                            <div className="d-flex align-items-center gap-4">
                                                <div className={`p-3 rounded-circle shadow-lg border border-white border-opacity-10 ${u.role === 'admin' ? 'bg-danger bg-opacity-10' : u.role === 'manager' ? 'bg-primary bg-opacity-10' : 'bg-accent bg-opacity-10'}`}>
                                                    {u.role === 'admin' ? <ShieldCheck size={20} className="text-danger" /> : u.role === 'manager' ? <Briefcase size={20} className="text-primary" /> : <User size={20} className="text-accent" />}
                                                </div>
                                                <div>
                                                    <div className="fw-900 text-white fs-6 mb-1">{u.name}</div>
                                                    <div className="text-secondary x-small opacity-50 fw-bold ls-1 font-monospace">UID:{u._id.slice(-8).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-secondary small fw-bold">
                                            <div className="d-flex align-items-center gap-2">
                                                <Mail size={14} className="text-danger opacity-50" /> {u.email}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            {getRoleBadge(u.role)}
                                        </td>
                                        <td className="py-4 pe-4 text-end">
                                            <Badge bg="success" className="bg-opacity-10 text-success p-1 rounded-circle border border-success border-opacity-20">
                                                <Activity size={10} />
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ManageUsers;
