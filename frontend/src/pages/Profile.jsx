import React, { useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { User, ShieldCheck, Mail, Target, Award, Shield, Zap, Info, Clock, CheckCircle, Activity, Globe } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
    );

    const stats = [
        { label: 'Security Clearance', value: user.role.toUpperCase(), icon: <Shield size={20} />, color: 'primary' },
        { label: 'Identity Protocol', value: 'V4.2 ACTIVE', icon: <Zap size={20} />, color: 'warning' },
        { label: 'Sync Integrity', value: '99.8%', icon: <CheckCircle size={20} />, color: 'success' },
    ];

    return (
        <div className="profile-page animate-fade-in pb-5">
            {/* Cinematic Identity Header */}
            <div className="profile-hero py-5 mb-5 position-relative overflow-hidden border-bottom border-white border-opacity-5" style={{ background: 'linear-gradient(135deg, #020617 0%, #1e1b4b 100%)' }}>
                <div className="hero-glow-1 opacity-20"></div>
                <Container className="position-relative" style={{ zIndex: 10 }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4 p-4 glass-card border-0 bg-transparent">
                        <div className="animate-slide-up">
                            <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-900 ls-2 mb-3 border border-primary border-opacity-10">
                                <ShieldCheck size={14} className="me-2" /> IDENTITY VERIFIED
                            </Badge>
                            <h1 className="display-4 fw-900 text-white mb-0 ls-tight">Global Account Dossier<span className="text-primary">.</span></h1>
                            <p className="text-secondary mt-2 mb-0 fw-bold opacity-75 d-flex align-items-center gap-2">
                                <Globe size={16} className="text-primary" /> Managing security nodes and personal synchronization parameters.
                            </p>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                <Row className="g-5">
                    {/* Identity Sidebar */}
                    <Col lg={4}>
                        <div className="sticky-top animate-slide-up" style={{ top: '120px' }}>
                            <Card className="glass-panel p-5 rounded-5 border-white border-opacity-10 shadow-22xl relative">
                                <div className="text-center position-relative mb-5">
                                    <div className="position-relative d-inline-block mb-4">
                                        <div className="bg-primary bg-opacity-10 p-1 rounded-circle border-2 border-primary border-opacity-30 shadow-indigo">
                                            <div className="p-2 rounded-circle bg-dark overflow-hidden" style={{ width: '120px', height: '120px' }}>
                                                <img 
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                                                    alt="avatar" 
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="position-absolute bottom-0 end-0 bg-success p-2 rounded-circle border-4 border-dark shadow-sm">
                                            <CheckCircle size={22} className="text-white" />
                                        </div>
                                    </div>
                                    <h3 className="fw-900 text-white mb-1 ls-tight">{user.name}</h3>
                                    <div className="text-primary small fw-900 ls-2 uppercase opacity-80 mb-4">{user.role} LEVEL ACCESS</div>
                                    <div className="p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5 d-flex align-items-center justify-content-center gap-3">
                                        <Mail size={16} className="text-secondary" />
                                        <span className="text-secondary small fw-bold">{user.email}</span>
                                    </div>
                                </div>

                                <hr className="border-white border-opacity-5 my-4" />

                                <div className="d-flex flex-column gap-3">
                                    <div className="p-4 rounded-4 border border-white border-opacity-10 d-flex align-items-center justify-content-between hover-scale cursor-pointer transition-all" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><Award size={20} /></div>
                                            <span className="text-white fw-bold">Loyalty Tier</span>
                                        </div>
                                        <span className="text-primary fw-900">PLATINUM</span>
                                    </div>
                                    <div className="p-4 rounded-4 border border-white border-opacity-10 d-flex align-items-center justify-content-between hover-scale cursor-pointer transition-all" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-info bg-opacity-10 p-2 rounded-3 text-info"><Activity size={20} /></div>
                                            <span className="text-white fw-bold">Active Syncs</span>
                                        </div>
                                        <span className="text-info fw-900">12</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>

                    {/* Security & Settings */}
                    <Col lg={8} className="animate-slide-up-delay">
                        <div className="analytics-intelligence mb-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="bg-primary bg-opacity-20 p-2 rounded-3 text-primary"><ShieldCheck size={24} /></div>
                                <div>
                                    <h4 className="fw-900 text-white mb-0 ls-tight">Security Intel</h4>
                                    <p className="text-secondary small fw-bold opacity-50 mb-0 ls-1 uppercase">Platform-wide safety & session metrics</p>
                                </div>
                            </div>

                            <Row className="g-4 mb-5">
                                {stats.map((s, idx) => (
                                    <Col md={4} key={idx}>
                                        <Card className="glass-card p-4 border-white border-opacity-5 h-100 shadow-lg text-center">
                                            <div className={`text-${s.color} bg-${s.color} bg-opacity-10 p-3 rounded-circle d-inline-block mx-auto mb-3 shadow-lg`}>
                                                {s.icon}
                                            </div>
                                            <h3 className="fw-900 text-white mb-1 ls-tight">{s.value}</h3>
                                            <span className="text-secondary small fw-bold uppercase ls-1 opacity-50">{s.label}</span>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {/* Session Activity */}
                            <div className="glass-card p-5 border-white border-opacity-10 shadow-22xl mb-5">
                                <h5 className="fw-900 text-white ls-tight mb-4 d-flex align-items-center gap-3">
                                    <Clock size={22} className="text-primary" /> Recent Synchronization Activity
                                </h5>
                                <div className="d-flex flex-column gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-success bg-opacity-10 p-2 rounded-circle text-success"><CheckCircle size={16} /></div>
                                                <div>
                                                    <div className="text-white small fw-900">Successful Auth Session</div>
                                                    <div className="text-secondary x-small fw-bold opacity-50 uppercase mt-1">IP Node: 192.168.1.{(i*14)%255}</div>
                                                </div>
                                            </div>
                                            <span className="text-secondary x-small fw-bold font-monospace opacity-50">{i}h ago</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preference Controls */}
                            <div className="glass-card p-5 border-white border-opacity-10 shadow-22xl">
                                <h5 className="fw-900 text-white ls-tight mb-5 d-flex align-items-center gap-3">
                                    <Target size={22} className="text-primary" /> Operational Preferences
                                </h5>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-secondary small fw-bold">Intel Visibility</span>
                                                <span className="text-white small fw-bold ls-1">90%</span>
                                            </div>
                                            <ProgressBar now={90} variant="primary" style={{ height: '6px' }} className="rounded-pill bg-white bg-opacity-5" />
                                        </div>
                                        <Button variant="outline-primary" className="w-100 rounded-pill py-3 fw-bold small ls-1 border-white border-opacity-10 mt-2">DOWNLOAD DATA DUMP</Button>
                                    </Col>
                                    <Col md={6}>
                                        <div className="p-4 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10">
                                            <div className="d-flex align-items-center gap-2 text-primary x-small fw-900 ls-2 uppercase mb-2">
                                                <Info size={14} fill="currentColor" /> Strategic Tip
                                            </div>
                                            <p className="text-secondary x-small fw-bold mb-0 opacity-75 lh-lg">Enable 2FA protocol to receive exclusive early-access nodes in the upcoming luxury sectors.</p>
                                        </div>
                                        <Button className="btn-premium w-100 py-3 mt-4 rounded-pill">EQUIP 2FA SECURITY</Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Profile;
