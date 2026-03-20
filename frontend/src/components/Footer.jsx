import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook, Globe, Shield, Zap, Award, ChevronRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-section mt-5 border-top border-white border-opacity-5" style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)' }}>
            <Container className="py-5 mt-5">
                <Row className="g-5">
                    {/* Brand & Mission */}
                    <Col lg={4}>
                        <Link to="/" className="navbar-brand mb-4 d-inline-flex">
                            <Zap className="me-2 text-primary" fill="currentColor" size={24} />
                            <span>V-LUXE<span className="text-white">HOTELS</span></span>
                        </Link>
                        <p className="text-secondary small fw-bold opacity-75 mb-4 pe-lg-5 ls-tight" style={{ lineHeight: '1.8' }}>
                            Redefining the hospitality landscape through algorithmic selection and premium asset management. Our network delivers exclusive stay nodes for high-value personnel globally.
                        </p>
                        <div className="d-flex gap-3 mb-5">
                            <div className="social-pill"><Instagram size={20} /></div>
                            <div className="social-pill"><Twitter size={20} /></div>
                            <div className="social-pill"><Facebook size={20} /></div>
                        </div>
                    </Col>

                    {/* Quick Ecosystem Links */}
                    <Col lg={2} md={4} xs={6}>
                        <h6 className="text-white fw-900 text-uppercase ls-2 mb-4">Discovery</h6>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/">Premium Assets</Link></li>
                            <li><Link to="/">Executive Suites</Link></li>
                            <li><Link to="/">Strategic Locations</Link></li>
                            <li><Link to="/">Loyalty Protocols</Link></li>
                        </ul>
                    </Col>

                    {/* Management Links */}
                    <Col lg={2} md={4} xs={6}>
                        <h6 className="text-white fw-900 text-uppercase ls-2 mb-4">Network</h6>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/login">Manager Terminal</Link></li>
                            <li><Link to="/register">Join as Partner</Link></li>
                            <li><Link to="/admin/dashboard">Admin Central</Link></li>
                            <li><Link to="/">Support Node</Link></li>
                        </ul>
                    </Col>

                    {/* Newsletter / Intel Uplink */}
                    <Col lg={4}>
                        <div className="glass-card p-4 border-white border-opacity-10 shadow-22xl">
                            <h6 className="text-white fw-900 text-uppercase ls-2 mb-2">Intel Broadcast</h6>
                            <p className="text-secondary x-small fw-bold mb-3">Subscribe for high-priority availability alerts.</p>
                            <Form className="position-relative">
                                <Form.Control 
                                    type="email" 
                                    placeholder="your-terminal-id@net.com" 
                                    className="bg-white bg-opacity-5 border-white border-opacity-10 p-3 rounded-pill text-white shadow-none ps-4"
                                />
                                <Button className="btn-primary rounded-pill position-absolute" style={{ top: '6px', right: '6px', padding: '10px 20px' }}>
                                    JOIN <ChevronRight size={14} className="ms-1" />
                                </Button>
                            </Form>
                            <div className="mt-3 d-flex align-items-center gap-2">
                                <Shield size={12} className="text-success" />
                                <span className="text-secondary x-small fw-900 ls-1">GDPR SECURED ENCRYPTION</span>
                            </div>
                        </div>
                    </Col>
                </Row>

                <hr className="border-white border-opacity-5 my-5" />

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
                    <div className="text-secondary x-small fw-900 ls-2 uppercase opacity-50">
                        &copy; 2026 V-LUXE HYPER-PROTOCOL. ALL RIGHTS SECURED.
                    </div>
                    <div className="d-flex gap-4">
                        <Link to="/" className="text-secondary x-small fw-900 ls-2 text-decoration-none hover-primary transition-all">PRIVACY_MD</Link>
                        <Link to="/" className="text-secondary x-small fw-900 ls-2 text-decoration-none hover-primary transition-all">TERMS_OF_SYNC</Link>
                        <Link to="/" className="text-secondary x-small fw-900 ls-2 text-decoration-none hover-primary transition-all">COOKIES_LITE</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
