import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { User, Calendar, MapPin, Star, Clock, CreditCard, ChevronRight, Zap, Target, Bookmark, ShieldCheck, Activity, Award, TrendingUp, CheckCircle, Hotel } from 'lucide-react';
import api from '../../services/api';

const CustomerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [bookingsRes, userRes] = await Promise.all([
                    api.get('/bookings/customer'),
                    api.get('/auth/me')
                ]);
                setBookings(bookingsRes.data);
                setUser(userRes.data);
            } catch (err) {
                console.error('Error fetching dashboard telemetry:', err);
                setError('Failed to sync with global registry.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="loader-container animate-fade-in"><div className="loader"></div></div>;

    const activeBookings = bookings.filter(b => b.bookingStatus === 'confirmed').length;
    const totalAttempts = bookings.length;

    return (
        <div className="customer-dashboard-page pb-5 animate-fade-in" style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
            {/* Cinematic Command Header */}
            <div className="dashboard-hero py-5 mb-5 position-relative overflow-hidden border-bottom border-white border-opacity-5" style={{ background: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)' }}>
                <div className="hero-glow-1 opacity-20"></div>
                <div className="hero-glow-2 opacity-15" style={{ top: '-10%', right: '10%' }}></div>
                <Container className="position-relative" style={{ zIndex: 10 }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 p-4 glass-card border-0 bg-transparent">
                        <div className="animate-slide-up">
                            <Badge bg="primary" className="bg-opacity-10 text-primary px-4 py-2 rounded-pill fw-900 ls-2 mb-3 border border-primary border-opacity-10 shadow-sm">
                                <ShieldCheck size={14} className="me-2" /> CORE ACCESS GRANTED
                            </Badge>
                            <h1 className="display-3 fw-900 text-white mb-2 ls-tight">Welcome, <span className="text-primary">{user?.name.split(' ')[0]}</span>.</h1>
                            <p className="text-secondary mb-0 fw-bold opacity-75 d-flex align-items-center gap-2">
                                <Activity size={18} className="text-primary animate-pulse-slow" /> Your luxury asset acquisition cycle is fully synchronized.
                            </p>
                        </div>
                        <div className="animate-slide-up-delay">
                            <Button as={Link} to="/" className="btn-primary px-5 py-4 rounded-pill border-0 shadow-22xl fw-900 ls-2 d-flex align-items-center gap-3 transform hover-scale transition-all">
                                START NEW DISCOVERY <Target size={22} />
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                <Row className="g-5">
                    {/* Main Telemetry: Left Side (Col 8) */}
                    <Col lg={8} className="animate-slide-up">
                        {/* Summary Metrics (Modern Blocks) */}
                        <Row className="g-4 mb-5">
                            <Col md={6}>
                                <div className="glass-card p-5 h-100 border-white border-opacity-10 shadow-22xl d-flex align-items-center gap-4 overflow-hidden position-relative group hover-scale transition-all">
                                    <div className="bg-primary bg-opacity-10 p-4 rounded-4 border border-primary border-opacity-20 position-relative shadow-indigo">
                                        <Calendar className="text-primary" size={32} />
                                    </div>
                                    <div className="position-relative">
                                        <div className="text-secondary x-small fw-800 text-uppercase ls-2 mb-1">Successful Stays</div>
                                        <h2 className="fw-900 text-white mb-0 display-4 font-monospace ls-tight">{activeBookings}</h2>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="glass-card p-5 h-100 border-white border-opacity-10 shadow-22xl d-flex align-items-center gap-4 overflow-hidden position-relative group hover-scale transition-all">
                                    <div className="bg-info bg-opacity-10 p-4 rounded-4 border border-info border-opacity-20 position-relative shadow-info">
                                        <Activity className="text-info" size={32} />
                                    </div>
                                    <div className="position-relative">
                                        <div className="text-secondary x-small fw-800 text-uppercase ls-2 mb-1">Total Attempts</div>
                                        <h2 className="fw-900 text-white mb-0 display-4 font-monospace ls-tight">{totalAttempts}</h2>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Recent History Feed */}
                        <div className="glass-card shadow-22xl border-white border-opacity-10 overflow-hidden animate-slide-up-delay mb-5" style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(40px)' }}>
                            <div className="p-4 d-flex justify-content-between align-items-center bg-white bg-opacity-5 border-bottom border-white border-opacity-10">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-20 p-2 rounded-3 text-primary"><Activity size={20} /></div>
                                    <h5 className="fw-900 mb-0 text-white ls-tight">RESERVATION LEDGER</h5>
                                </div>
                                <Link to="/my-bookings" className="btn btn-primary btn-sm rounded-pill px-4 fw-800 ls-1 shadow-indigo border-0">
                                    FULL METRICS <ChevronRight size={14} className="ms-1" />
                                </Link>
                            </div>
                            
                            {bookings.length === 0 ? (
                                <div className="p-5 text-center py-5">
                                    <Clock size={80} strokeWidth={1} className="text-primary opacity-25 mb-4 animate-pulse-slow" />
                                    <h4 className="text-white fw-900 mb-2">Registry Silent</h4>
                                    <p className="text-secondary fw-bold small opacity-75 mb-0 ls-1">NO BIOMETRIC DATA FOUND FOR PREVIOUS DEPLOYMENTS.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover variant="dark" className="m-0 align-middle border-0" style={{ background: 'transparent' }}>
                                        <thead className="bg-white bg-opacity-5 border-0">
                                            <tr className="border-0">
                                                <th className="py-4 ps-4 text-secondary small fw-900 ls-2 uppercase border-0">ASSET ENTITY</th>
                                                <th className="py-4 text-secondary small fw-900 ls-2 uppercase border-0 text-center">CHECK-IN</th>
                                                <th className="py-4 text-secondary small fw-900 ls-2 uppercase border-0 text-center">STATUS</th>
                                                <th className="py-4 pe-4 text-secondary small fw-900 ls-2 uppercase border-0 text-end">YIELD</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-0">
                                            {bookings.slice(0, 5).map(booking => (
                                                <tr key={booking._id} className="border-bottom border-white border-opacity-5 transition-all">
                                                    <td className="py-4 ps-4 border-0">
                                                        <div className="d-flex align-items-center gap-4">
                                                            <div className="bg-white bg-opacity-5 rounded-4 overflow-hidden border border-white border-opacity-10 shadow-sm" style={{ width: '85px', height: '62px' }}>
                                                                {booking.hotelId?.images?.[0] ? (
                                                                    <img src={booking.hotelId.images[0]} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                                ) : (
                                                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-primary opacity-50">
                                                                        <Hotel size={24} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="fw-900 text-white fs-6 mb-1">{booking.hotelId?.name || 'Unknown Asset'}</div>
                                                                <div className="text-secondary x-small opacity-50 fw-bold ls-1 uppercase d-flex align-items-center gap-1">
                                                                    <MapPin size={10} className="text-primary" /> {booking.hotelId?.city || 'SECURE_ZONE'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-center border-0">
                                                        <div className="text-white small fw-900">{new Date(booking.checkInDate).toLocaleDateString()}</div>
                                                        <div className="text-secondary x-small opacity-50 fw-bold ls-1 mt-1 uppercase">Deployment Node</div>
                                                    </td>
                                                    <td className="py-4 text-center border-0">
                                                        <Badge bg={booking.bookingStatus === 'confirmed' ? 'success' : 'danger'} 
                                                               className="bg-opacity-20 text-white border border-white border-opacity-10 px-3 py-2 rounded-pill small fw-900 ls-1 shadow-sm">
                                                            {booking.bookingStatus.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 pe-4 text-end border-0">
                                                        <div className="fw-900 text-primary fs-5">₹{booking.totalAmount.toLocaleString()}</div>
                                                        <div className="text-secondary x-small opacity-50 fw-900 ls-1 lowercase">total_impact</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* Tactical Sidebar: Right Side (Col 4) */}
                    <Col lg={4} className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="d-flex flex-column gap-5 sticky-top" style={{ top: '120px' }}>
                            {/* Profile Hub */}
                            <div className="glass-card p-5 border-white border-opacity-10 shadow-22xl overflow-hidden relative" style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
                                <div className="hero-glow-1 opacity-10" style={{ top: '-40%', right: '-40%', width: '100%', height: '100%' }}></div>
                                <div className="text-center position-relative mb-5" style={{ zIndex: 1 }}>
                                    <div className="position-relative d-inline-block mb-4">
                                        <div className="bg-primary bg-opacity-10 p-1 rounded-circle border-2 border-primary border-opacity-30 shadow-indigo">
                                            <div className="p-4 rounded-circle bg-dark overflow-hidden">
                                                <User size={60} className="text-primary" />
                                            </div>
                                        </div>
                                        <div className="position-absolute bottom-0 end-0 bg-success p-2 rounded-circle border-4 border-dark shadow-sm">
                                            <CheckCircle size={18} className="text-white" />
                                        </div>
                                    </div>
                                    <h3 className="fw-900 text-white mb-1 ls-tight">{user?.name}</h3>
                                    <div className="text-secondary small fw-bold opacity-50 mb-4">{user?.email}</div>
                                    <Badge bg="warning" className="bg-opacity-10 text-warning px-4 py-2 rounded-pill fw-900 ls-2 border border-warning border-opacity-20 d-inline-flex align-items-center shadow-lg">
                                        <Award size={16} className="me-2" /> GOLD VOYAGER
                                    </Badge>
                                </div>

                                <div className="d-flex flex-column gap-3 mb-5 position-relative" style={{ zIndex: 1 }}>
                                    <div className="p-4 rounded-4 border border-white border-opacity-10 hover-scale cursor-pointer transition-all" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><Bookmark size={20} /></div>
                                                <span className="text-white fw-bold">Saved Collections</span>
                                            </div>
                                            <Badge bg="primary" className="bg-opacity-20 text-white border border-primary border-opacity-10 px-3 py-1 rounded-pill">12</Badge>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-4 border border-white border-opacity-10 hover-scale cursor-pointer transition-all" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success"><CreditCard size={20} /></div>
                                                <span className="text-white fw-bold">Available Credits</span>
                                            </div>
                                            <span className="text-success fw-900">₹4,450</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="position-relative" style={{ zIndex: 1 }}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="text-white x-small fw-800 text-uppercase ls-2 opacity-50">Loyalty Strategy</h6>
                                        <TrendingUp size={16} className="text-primary animate-pulse-slow" />
                                    </div>
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between mb-3 small fw-900">
                                            <span className="text-secondary d-flex align-items-center gap-2">PLATINUM PROGRESS</span>
                                            <span className="text-white">68%</span>
                                        </div>
                                        <ProgressBar now={68} variant="primary" style={{ height: '10px' }} className="rounded-pill bg-white bg-opacity-5 shadow-inner" />
                                        <p className="text-secondary x-small mt-3 opacity-50 fw-900 ls-1">3 MORE RESERVATIONS TO UNLOCK GLOBAL LOUNGE ACCESS.</p>
                                    </div>
                                    <Button variant="outline-primary" className="w-100 rounded-pill py-3 fw-bold small ls-2 border-white border-opacity-20 shadow-lg hover-scale">EDIT BIOMETRIC IDENTITY</Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CustomerDashboard;
