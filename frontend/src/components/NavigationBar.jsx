import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Badge, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, User, LogOut, ShieldCheck, Briefcase, ChevronDown, Bell, Search, Menu } from 'lucide-react';

const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <Navbar 
            expand="lg" 
            fixed="top"
            className={`transition-all duration-500 py-3 ${scrolled ? 'glass-panel py-2 shadow-2xl backdrop-blur-xl bg-opacity-80' : 'bg-transparent'}`}
            variant="dark"
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 hover-scale transition-all">
                    <div className="bg-primary rounded-3 p-2 shadow-lg shadow-primary-glow">
                        <MapPin className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-outfit fs-4 fw-800 text-white ls-tight">
                        StaySphere<span className="text-primary">.</span>
                    </span>
                </Navbar.Brand>
                
                <Navbar.Toggle className="border-0 shadow-none">
                    <Menu size={24} className="text-white" />
                </Navbar.Toggle>
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-lg-5 me-auto gap-1">
                        <Nav.Link as={Link} to="/" className={`px-4 py-2 rounded-pill font-outfit fw-600 transition-all small uppercase ls-1 ${isActive('/') ? 'text-primary bg-primary bg-opacity-10' : 'text-secondary hover-text-white'}`}>
                            EXPLORE
                        </Nav.Link>
                        {user && (
                            <Nav.Link 
                                as={Link} 
                                to={user.role === 'customer' ? '/customer/dashboard' : user.role === 'manager' ? '/manager/dashboard' : '/admin/dashboard'} 
                                className={`px-4 py-2 rounded-pill font-outfit fw-600 transition-all small uppercase ls-1 ${location.pathname.includes('dashboard') ? 'text-primary bg-primary bg-opacity-10' : 'text-secondary hover-text-white'}`}
                            >
                                {user.role === 'admin' ? 'SYSTEM CMD' : 'DASHBOARD'}
                            </Nav.Link>
                        )}
                        {user?.role === 'customer' && (
                            <Nav.Link as={Link} to="/my-bookings" className={`px-4 py-2 rounded-pill font-outfit fw-600 transition-all small uppercase ls-1 ${isActive('/my-bookings') ? 'text-primary bg-primary bg-opacity-10' : 'text-secondary hover-text-white'}`}>
                                RESERVATIONS
                            </Nav.Link>
                        )}
                    </Nav>
                    
                    <div className="d-flex align-items-center gap-4 mt-3 mt-lg-0">
                        {user ? (
                            <div className="d-flex align-items-center gap-3">
                                <div className="d-none d-xl-flex flex-column align-items-end me-1">
                                    <span className="text-white fw-800 small lh-1 mb-1">{user.name.toUpperCase()}</span>
                                    <span className="text-primary fw-900 x-small ls-2 opacity-80 uppercase">{user.role}</span>
                                </div>
                                
                                <Dropdown align="end">
                                    <Dropdown.Toggle as="div" className="cursor-pointer hover-scale transition-all">
                                        <div className="position-relative">
                                            <div className="bg-slate-800 border-2 border-primary border-opacity-30 rounded-full p-1 overflow-hidden" style={{ width: '42px', height: '42px' }}>
                                                <img 
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                                                    alt="avatar" 
                                                    className="w-100 h-100 rounded-full object-fit-cover"
                                                />
                                            </div>
                                            <div className="position-absolute bottom-0 end-0 bg-success border-2 border-slate-900 rounded-full" style={{ width: '12px', height: '12px' }}></div>
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="glass-panel border-white border-opacity-10 shadow-2xl p-2 mt-3 rounded-4 dropdown-menu-dark">
                                        <div className="px-3 py-2 border-bottom border-white border-opacity-5 mb-2">
                                            <div className="text-white fw-800 small">{user.email}</div>
                                            <div className="text-secondary x-small fw-bold mt-1 ls-1">{user.role.toUpperCase()} ACCOUNT</div>
                                        </div>
                                        
                                        <Dropdown.Item as={Link} to="/profile" className="rounded-3 py-2 d-flex align-items-center gap-3 text-white-50 hover-text-white hover-bg-primary hover-bg-opacity-20 transition-all">
                                            <User size={16} /> <span className="small fw-600 ls-05">Account Profile</span>
                                        </Dropdown.Item>
                                        
                                        <Dropdown.Item onClick={handleLogout} className="rounded-3 py-2 d-flex align-items-center gap-3 text-danger hover-bg-danger hover-bg-opacity-10 transition-all mt-1">
                                            <LogOut size={16} /> <span className="small fw-600 ls-05">Terminate Session</span>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                                <Link to="/login" className="px-4 py-2 text-decoration-none text-secondary hover-text-white fw-800 small ls-1 transition-all">
                                    LOGIN
                                </Link>
                                <Button as={Link} to="/register" className="btn-premium px-4 rounded-pill">
                                    INITIALIZE
                                </Button>
                            </div>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
            
            <style>{`
                .dropdown-toggle::after { display: none; }
                .cursor-pointer { cursor: pointer; }
                .ls-05 { letter-spacing: 0.05em; }
                .x-small { font-size: 0.65rem; }
                .rounded-full { border-radius: 50% !important; }
            `}</style>
        </Navbar>
    );
};

export default NavigationBar;
