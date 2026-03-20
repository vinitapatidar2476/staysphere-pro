import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Sparkles } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/auth/register', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="login-page min-vh-100 d-flex align-items-center py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} lg={8} xl={6}>
                        <div className="text-center mb-5">
                            <Sparkles className="text-secondary mb-3 animate-float" size={42} />
                            <h2 className="display-6 fw-800 gradient-text">Join StaySphere</h2>
                            <p className="text-secondary opacity-75">Start your journey to the world's most exclusive destinations</p>
                        </div>

                        <div className="glass-card p-4 p-md-5">
                            {error && (
                                <Alert variant="danger" className="border-0 rounded-4 bg-danger bg-opacity-10 text-danger mb-4 small">
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert variant="success" className="border-0 rounded-4 bg-success bg-opacity-10 text-success mb-4 small">
                                    {success}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Row g={4}>
                                    <Col md={12} className="mb-4">
                                        <Form.Label className="text-secondary small fw-bold text-uppercase ms-1 mb-2">Full Name</Form.Label>
                                        <div className="position-relative">
                                            <div className="position-absolute h-100 d-flex align-items-center ps-3 text-secondary">
                                                <User size={18} />
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                placeholder="Enter your name"
                                                onChange={handleChange}
                                                required
                                                className="ps-5"
                                            />
                                        </div>
                                    </Col>

                                    <Col md={12} className="mb-4">
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
                                    </Col>

                                    <Col md={12} className="mb-4">
                                        <Form.Label className="text-secondary small fw-bold text-uppercase ms-1 mb-2">Password</Form.Label>
                                        <div className="position-relative">
                                            <div className="position-absolute h-100 d-flex align-items-center ps-3 text-secondary">
                                                <Lock size={18} />
                                            </div>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder="Create a strong password"
                                                onChange={handleChange}
                                                required
                                                className="ps-5"
                                            />
                                        </div>
                                    </Col>

                                    <Col md={12} className="mb-5">
                                        <Form.Label className="text-secondary small fw-bold text-uppercase ms-1 mb-2">Account Strategy</Form.Label>
                                        <Form.Select name="role" onChange={handleChange} className="form-control py-3 shadow-none border-white border-opacity-10 bg-white bg-opacity-5 text-white">
                                            <option value="customer" style={{background: 'var(--bg-main)'}}>Register as Traveler (Customer)</option>
                                            <option value="manager" style={{background: 'var(--bg-main)'}}>Register as Property Owner (Manager)</option>
                                        </Form.Select>
                                    </Col>
                                </Row>

                                <Button type="submit" className="w-100 p-3 btn-primary d-flex align-items-center justify-content-center gap-2">
                                    <UserPlus size={20} />
                                    <span className="fw-bold">Create Account</span>
                                </Button>
                            </Form>

                            <div className="text-center mt-5">
                                <span className="text-secondary small">Already have an account? </span>
                                <Link to="/login" className="text-primary small fw-bold text-decoration-none hover-underline">
                                    Login Instead
                                </Link>
                            </div>
                        </div>

                        <div className="text-center mt-4 text-secondary small opacity-50">
                            By joining, you agree to our Terms of Service & Privacy Policy.
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
