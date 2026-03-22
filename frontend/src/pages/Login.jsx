import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', formData);
            const { token, role, name } = res.data;
            login(token, role, name);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Unauthorized access. Verify credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page min-vh-100 d-flex align-items-center py-5 animate-fade-in" style={{
            background: 'radial-gradient(circle at top right, rgba(99,102,241,0.08), transparent), radial-gradient(circle at bottom left, rgba(244,63,94,0.08), transparent)'
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={5} md={8}>
                        <div className="text-center mb-5 animate-slide-up">
                            <div className="bg-primary d-inline-flex p-3 rounded-4 shadow-lg mb-4 shadow-primary-glow">
                                <ShieldCheck className="text-white" size={32} strokeWidth={2.5} />
                            </div>
                            <h2 className="display-5 fw-900 text-white ls-tight mb-2">Initialize Session</h2>
                            <p className="text-secondary fw-bold small ls-1 opacity-75">AUTHENTICATE TO ACCESS THE ELITE NETWORK</p>
                        </div>

                        <Card className="glass-panel p-4 p-md-5 rounded-5 border-white border-opacity-10 shadow-22xl animate-slide-up-delay">
                            {error && (
                                <div className="alert-glass border-danger border-opacity-20 text-danger p-3 rounded-4 mb-4 small fw-bold d-flex align-items-center gap-3">
                                    <div className="bg-danger bg-opacity-10 p-2 rounded-circle"><Lock size={16} /></div>
                                    {error}
                                </div>
                            )}

                            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                                <Form.Group>
                                    <Form.Label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Network ID (Email)</Form.Label>
                                    <InputGroup className="glass-card bg-white bg-opacity-5 rounded-4 overflow-hidden border-white border-opacity-10 focus-within-primary transition-all">
                                        <InputGroup.Text className="bg-transparent border-0 ps-4 pe-2 text-secondary">
                                            <Mail size={18} />
                                        </InputGroup.Text>
                                        <Form.Control 
                                            name="email" 
                                            type="email" 
                                            placeholder="identity@staysphere.net" 
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="bg-transparent border-0 text-white shadow-none py-3"
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Form.Label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-0">Security Key</Form.Label>
                                        <Link to="/forgot-password" size="sm" className="text-primary text-decoration-none x-small fw-900 ls-1">RESET KEY?</Link>
                                    </div>
                                    <InputGroup className="glass-card bg-white bg-opacity-5 rounded-4 overflow-hidden border-white border-opacity-10 focus-within-primary transition-all">
                                        <InputGroup.Text className="bg-transparent border-0 ps-4 pe-2 text-secondary">
                                            <Lock size={18} />
                                        </InputGroup.Text>
                                        <Form.Control 
                                            name="password" 
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder="••••••••••••" 
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="bg-transparent border-0 text-white shadow-none py-3"
                                        />
                                        <Button 
                                            variant="link" 
                                            className="bg-transparent border-0 px-4 text-secondary shadow-none" 
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="btn-premium w-100 py-3 mt-2 rounded-pill shadow-22xl transform transition-all active-scale"
                                >
                                    {loading ? (
                                        <><Spinner size="sm" animation="border" className="me-2" /> PROCESSING...</>
                                    ) : (
                                        <><LogIn size={18} /> AUTHENTICATE <ArrowRight size={18} className="ms-auto" /></>
                                    )}
                                </Button>
                            </Form>

                            <div className="mt-5 pt-4 text-center border-top border-white border-opacity-5">
                                <p className="text-secondary small fw-bold opacity-50 mb-4 ls-1 font-monospace uppercase">New to StaySphere Protocol?</p>
                                <Button as={Link} to="/register" variant="outline-premium" className="w-100 rounded-pill py-3 d-flex align-items-center justify-content-center gap-3">
                                    <UserPlus size={18} /> REGISTER NEW NODE
                                </Button>
                            </div>
                        </Card>
                        
                        <p className="text-center text-secondary x-small mt-5 opacity-40 fw-bold ls-1 uppercase font-monospace">
                            Secured by StaySphere Auth v4.2 · Quantum Safe
                        </p>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .focus-within-primary:focus-within {
                    border-color: var(--primary) !important;
                    background: rgba(99, 102, 241, 0.05) !important;
                    box-shadow: 0 0 0 1px var(--primary) !important;
                }
                .ls-05 { letter-spacing: 0.05em; }
                .x-small { font-size: 0.65rem; }
                .active-scale:active { transform: scale(0.98); }
                .alert-glass { background: rgba(239, 68, 68, 0.05); }
            `}</style>
        </div>
    );
};

export default Login;
