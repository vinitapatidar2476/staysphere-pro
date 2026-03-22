import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, LogIn, HardDrive, Globe } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', formData);
            alert('REGISTRATION SUCCESSFUL: Identity verified. Please authenticate to access the network.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Check network or credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page min-vh-100 d-flex align-items-center py-5 animate-fade-in" style={{
            background: 'radial-gradient(circle at top right, rgba(99,102,241,0.08), transparent), radial-gradient(circle at bottom left, rgba(244,63,94,0.08), transparent)'
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={10} xl={9}>
                        <Card className="glass-panel overflow-hidden rounded-5 border-white border-opacity-10 shadow-22xl animate-slide-up-delay">
                            <Row className="g-0">
                                <Col lg={5} className="d-none d-lg-flex flex-column justify-content-center p-5 bg-primary bg-opacity-5 position-relative overflow-hidden">
                                    <div className="hero-glow-1 position-absolute top-0 start-0 w-100 h-100 opacity-20"></div>
                                    <div className="position-relative" style={{ zIndex: 5 }}>
                                        <div className="bg-primary d-inline-flex p-3 rounded-4 shadow-lg mb-4 shadow-primary-glow">
                                            <HardDrive className="text-white" size={32} strokeWidth={2.5} />
                                        </div>
                                        <h2 className="display-6 fw-900 text-white ls-tight mb-4 mt-2">Initialize Your Journey.</h2>
                                        <p className="text-secondary fw-bold fs-6 opacity-80 mb-5 lh-lg">Join the world's most elite stay network and synchronize your travel footprint across 12,000+ luxury assets.</p>
                                        
                                        <div className="d-flex flex-column gap-4">
                                            <div className="d-flex align-items-center gap-4 group">
                                                {/* The provided Code Edit snippet for Badge and bookingStatus is not relevant to this Register component.
                                                    It seems to be from a different component. I will not insert it here to maintain context and syntax.
                                                    The instruction "Add safe toUpperCase" likely refers to that snippet.
                                                    The instruction "fix registration navigation" is addressed by ensuring the current navigation to /login is correct for registration.
                                                */}
                                                <div className="bg-white bg-opacity-5 p-3 rounded-4 border border-white border-opacity-5 shadow-lg group-hover:bg-primary transition-all">
                                                    <Globe className="text-primary" size={20} />
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <span className="text-white fw-800 small ls-1">GLOBAL COVERAGE</span>
                                                    <span className="text-secondary x-small fw-bold opacity-50 uppercase mt-1 ls-1">Sectors fully operational</span>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-4 group mt-1">
                                                <div className="bg-white bg-opacity-5 p-3 rounded-4 border border-white border-opacity-5 shadow-lg transition-all">
                                                    <ShieldCheck className="text-primary" size={20} />
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <span className="text-white fw-800 small ls-1">ZERO-TRUST DATA</span>
                                                    <span className="text-secondary x-small fw-bold opacity-50 uppercase mt-1 ls-1">Military-grade protection</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={7} className="p-4 p-md-5 bg-dark bg-opacity-20 backdrop-blur-3xl">
                                    <div className="mb-5 text-center text-lg-start">
                                        <h3 className="fw-900 text-white ls-tight fs-2 mb-2">Create Global Identity</h3>
                                        <p className="text-secondary fw-bold small ls-1 opacity-75">IDENTITY VERIFICATION FOR SECURE NODE ACCESS</p>
                                    </div>

                                    {error && (
                                        <div className="alert-glass border-danger border-opacity-20 text-danger p-3 rounded-4 mb-5 small fw-bold d-flex align-items-center gap-3">
                                            <div className="bg-danger bg-opacity-10 p-2 rounded-circle"><ShieldCheck size={16} /></div>
                                            {error}
                                        </div>
                                    )}

                                    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                                        <Row className="g-4">
                                            <Col md={12}>
                                                <Form.Label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Operator Name</Form.Label>
                                                <InputGroup className="glass-card bg-white bg-opacity-5 rounded-4 overflow-hidden border-white border-opacity-10 focus-within-primary transition-all">
                                                    <InputGroup.Text className="bg-transparent border-0 ps-4 pe-2 text-secondary"><User size={18} /></InputGroup.Text>
                                                    <Form.Control 
                                                        name="name" type="text" placeholder="Full identity name" 
                                                        value={formData.name} onChange={handleChange} required 
                                                        className="bg-transparent border-0 text-white shadow-none py-3"
                                                    />
                                                </InputGroup>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Network Handle (Email)</Form.Label>
                                                <InputGroup className="glass-card bg-white bg-opacity-5 rounded-4 overflow-hidden border-white border-opacity-10 focus-within-primary transition-all">
                                                    <InputGroup.Text className="bg-transparent border-0 ps-4 pe-2 text-secondary"><Mail size={18} /></InputGroup.Text>
                                                    <Form.Control 
                                                        name="email" type="email" placeholder="identity@staysphere.net" 
                                                        value={formData.email} onChange={handleChange} required 
                                                        className="bg-transparent border-0 text-white shadow-none py-3"
                                                    />
                                                </InputGroup>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Security Key</Form.Label>
                                                <InputGroup className="glass-card bg-white bg-opacity-5 rounded-4 overflow-hidden border-white border-opacity-10 focus-within-primary transition-all">
                                                    <InputGroup.Text className="bg-transparent border-0 ps-4 pe-2 text-secondary"><Lock size={18} /></InputGroup.Text>
                                                    <Form.Control 
                                                        name="password" type={showPassword ? 'text' : 'password'} 
                                                        placeholder="••••••••••••" value={formData.password} 
                                                        onChange={handleChange} required 
                                                        className="bg-transparent border-0 text-white shadow-none py-3"
                                                    />
                                                    <Button variant="link" className="bg-transparent border-0 px-3 text-secondary shadow-none" onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </Button>
                                                </InputGroup>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Operational Role</Form.Label>
                                                <Form.Select 
                                                    name="role" value={formData.role} onChange={handleChange}
                                                    className="bg-white bg-opacity-5 border-white border-opacity-10 p-3 text-white shadow-none rounded-4 fs-6 ls-05 fw-600 focus-within-primary"
                                                    style={{ height: '56px' }}
                                                >
                                                    <option value="customer" className="bg-dark">GLOBAL CUSTOMER</option>
                                                    <option value="manager" className="bg-dark">ASSET MANAGER</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>

                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="btn-premium w-100 py-4 mt-4 rounded-pill shadow-22xl transform transition-all active-scale fs-6"
                                        >
                                            {loading ? (
                                                <><Spinner size="sm" animation="border" className="me-2" /> INITIALIZING NODE...</>
                                            ) : (
                                                <><UserPlus size={20} /> REGISTER NEW NODE <ArrowRight size={20} className="ms-auto" /></>
                                            )}
                                        </Button>

                                        <div className="mt-5 pt-4 text-center border-top border-white border-opacity-5">
                                            <p className="text-secondary small fw-bold opacity-50 mb-0 ls-1">
                                                Already have a node identity? <Link to="/login" className="text-primary text-decoration-none fw-900 ms-2 ls-1 uppercase small">SIGN IN HERE</Link>
                                            </p>
                                        </div>
                                    </Form>
                                </Col>
                            </Row>
                        </Card>
                        
                        <p className="text-center text-secondary x-small mt-5 opacity-40 fw-bold ls-1 uppercase font-monospace">
                            StaySphere Identity Protocol v2.8.4.1 · Encrypted
                        </p>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .focus-within-primary:focus-within {
                    border-color: var(--primary) !important;
                    background: rgba(99, 102, 241, 0.05) !important;
                }
                .ls-05 { letter-spacing: 0.05em; }
                .x-small { font-size: 0.65rem; }
                .active-scale:active { transform: scale(0.98); }
                .hero-glow-1 { background: radial-gradient(circle at bottom right, rgba(99,102,241,0.2), transparent); }
            `}</style>
        </div>
    );
};

export default Register;
