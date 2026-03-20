import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, User, LogOut, ShieldCheck, Briefcase } from 'lucide-react';

const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getRoleIcon = () => {
        if (!user) return null;
        if (user.role === 'manager') return <Briefcase size={14} className="text-primary" />;
        if (user.role === 'admin') return <ShieldCheck size={14} className="text-danger" />;
        return <User size={14} className="text-accent" />;
    };

    return (
        <Navbar expand="lg" className="navbar py-3 animate-fade-in" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand hover-scale">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-1">
                        <MapPin className="text-primary animate-float" size={26} strokeWidth={3} />
                    </div>
                    <span>StaySphere<span className="text-primary">.</span></span>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-lg-5 me-auto gap-2">
                        <Nav.Link as={Link} to="/" className="nav-link px-3 py-2 rounded-pill transition-all fw-bold">Home</Nav.Link>
                        {user && user.role === 'customer' && (
                            <>
                                <Nav.Link as={Link} to="/customer/dashboard" className="nav-link px-3 py-2 rounded-pill transition-all fw-bold">Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/my-bookings" className="nav-link px-3 py-2 rounded-pill transition-all fw-bold">My Bookings</Nav.Link>
                            </>
                        )}
                        {user && user.role === 'manager' && (
                            <Nav.Link as={Link} to="/manager/dashboard" className="nav-link px-3 py-2 rounded-pill transition-all fw-bold">Dashboard</Nav.Link>
                        )}
                        {user && user.role === 'admin' && (
                            <Nav.Link as={Link} to="/admin/dashboard" className="nav-link px-3 py-2 rounded-pill transition-all fw-bold">Admin Panel</Nav.Link>
                        )}
                    </Nav>
                    
                    <Nav className="gap-3 mt-3 mt-lg-0 align-items-center">
                        {user ? (
                            <div className="d-flex align-items-center gap-3 glass-card px-2 py-1 pe-3 rounded-pill border border-white border-opacity-5 shadow-lg group hover-scale transition-all">
                                <div className={`p-2 rounded-circle shadow-sm animate-float ${user.role === 'manager' ? 'bg-primary bg-opacity-10 font-bold' : user.role === 'admin' ? 'bg-danger bg-opacity-10' : 'bg-accent bg-opacity-10'}`}>
                                    {getRoleIcon()}
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                    <span className="fw-900 small text-white ls-tight">{user.name}</span>
                                    <div className="d-flex align-items-center gap-1">
                                        <Badge bg="transparent" className={`p-0 x-small fw-bold ls-1 text-uppercase opacity-50 ${user.role === 'manager' ? 'text-primary' : user.role === 'admin' ? 'text-danger' : 'text-accent'}`}>
                                            {user.role}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="ms-2 border-start border-white border-opacity-10 ps-3">
                                    <button onClick={handleLogout} className="border-0 bg-transparent p-0 text-secondary hover-text-danger transition-all" title="Logout session">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex gap-2 align-items-center">
                                <Link to="/login" className="text-decoration-none py-2 px-4 fw-800 text-white opacity-60 hover-opacity-100 transition-all small ls-1">
                                    LOGIN
                                </Link>
                                <Button as={Link} to="/register" className="btn-primary px-4 py-2 fw-bold text-uppercase small ls-2 shadow-lg border-0 rounded-pill">
                                    SIGN UP
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
