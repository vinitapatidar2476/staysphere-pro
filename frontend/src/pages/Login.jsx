import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, Plane } from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', credentials);
            login(res.data.token, res.data.role, res.data.name);
            if (res.data.role === 'admin') navigate('/admin/dashboard');
            else if (res.data.role === 'manager') navigate('/manager/dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-page min-vh-100 d-flex align-items-center py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <div className="text-center mb-5 animate-float">
                            <Plane className="text-primary mb-3" size={48} strokeWidth={2.5} />
                            <h2 className="display-6 fw-800 gradient-text">Welcome Back</h2>
                            <p className="text-secondary opacity-75">Sign in to manage your luxury escapes</p>
                        </div>
                        
                        <div className="glass-card p-4 p-md-5">
                            {error && (
                                <Alert variant="danger" className="border-0 rounded-4 bg-danger bg-opacity-10 text-danger mb-4 small">
                                    {error}
                                </Alert>
                            )}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-secondary small fw-bold text-uppercase ms-1 mb-2">Email Address</Form.Label>
                                    <div className="position-relative">
                                        <div className="position-absolute h-100 d-flex align-items-center ps-3 text-secondary">
                                            <Mail size={18} />
                                        </div>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            onChange={handleChange}
                                            required
                                            className="ps-5"
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-5">
                                    <div className="d-flex justify-content-between">
                                        <Form.Label className="text-secondary small fw-bold text-uppercase ms-1 mb-2">Password</Form.Label>
                                        <Link to="#" className="text-primary small fw-bold text-decoration-none opacity-75">Forgot?</Link>
                                    </div>
                                    <div className="position-relative">
                                        <div className="position-absolute h-100 d-flex align-items-center ps-3 text-secondary">
                                            <Lock size={18} />
                                        </div>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            onChange={handleChange}
                                            required
                                            className="ps-5"
                                        />
                                    </div>
                                </Form.Group>

                                <Button type="submit" className="w-100 p-3 btn-primary d-flex align-items-center justify-content-center gap-2">
                                    <LogIn size={20} />
                                    <span className="fw-bold">Login to Account</span>
                                </Button>
                            </Form>
                            
                            <div className="text-center mt-5">
                                <span className="text-secondary small">New to StaySphere? </span>
                                <Link to="/register" className="text-primary small fw-bold text-decoration-none hover-underline">
                                    Create An Account
                                </Link>
                            </div>
                        </div>
                        
                        <div className="text-center mt-4 text-secondary small opacity-50">
                            &copy; 2024 StaySphere Luxury Hotels Global
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
