import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { MapPin, Calendar, Users, DollarSign, XCircle, Star, MessageSquare, ShieldCheck, Clock, CheckCircle, ChevronRight, Activity } from 'lucide-react';
import api from '../services/api';

const CustomerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Review Modal State
    const [showReview, setShowReview] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/bookings/customer');
            setBookings(res.data);
        } catch (err) {
            setError('Failed to fetch reservation telemetry.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to terminate this reservation and initiate a refund if applicable?')) return;
        try {
            const res = await api.post(`/bookings/${id}/cancel`);
            alert(res.data.message);
            fetchBookings();
        } catch (err) {
            alert('Operation failed. Contact node administrator.');
        }
    };

    const handlePostReview = async () => {
        try {
            await api.post('/reviews', {
                hotelId: selectedBooking.hotelId._id,
                rating: reviewData.rating,
                comment: reviewData.comment
            });
            setShowReview(false);
            setReviewData({ rating: 5, comment: '' });
            alert('Strategy Feedback Broadcasted Successfully!');
        } catch (err) {
            alert('Feedback uplink failed.');
        }
    };

    if (loading) return <div className="loader-container animate-fade-in"><div className="loader"></div></div>;

    return (
        <div className="customer-bookings-page pb-5 animate-fade-in">
            {/* Cinematic Header */}
            <div className="command-center-header py-5 mb-5 position-relative overflow-hidden border-bottom border-white border-opacity-5" style={{ background: 'var(--bg-main)' }}>
                <div className="hero-glow-1 opacity-10"></div>
                <Container className="position-relative" style={{ zIndex: 10 }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 p-4 glass-card border-0 bg-transparent">
                        <div className="animate-slide-up">
                            <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-800 ls-2 mb-3 border border-primary border-opacity-10">
                                <ShieldCheck size={14} className="me-2" /> GUEST PROTOCOL
                            </Badge>
                            <h2 className="display-4 fw-900 text-white mb-2 ls-tight">Reservation Ledger<span className="text-primary">.</span></h2>
                            <p className="text-secondary mb-0 fw-bold opacity-75 d-flex align-items-center gap-2">
                                <Activity size={16} className="text-primary" /> Tracking your luxury asset acquisitions and stay cycles.
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-5 p-3 px-4 rounded-4 border border-white border-opacity-10 animate-slide-up-delay">
                            <div className="text-secondary x-small fw-800 text-uppercase ls-1 mb-1">Total Deployments</div>
                            <div className="text-white fw-900 fs-3">{bookings.length} <span className="text-primary small fw-bold">ACTIVE</span></div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                {error && <Alert variant="danger" className="glass-card border-danger text-white mb-5">{error}</Alert>}
                
                {bookings.length === 0 ? (
                    <div className="text-center py-5 glass-card rounded-5 border-dashed border-white border-opacity-10 animate-slide-up">
                        <Clock size={80} strokeWidth={1} className="text-primary opacity-25 mb-4" />
                        <h4 className="text-white fw-900">No Reservations Discovered</h4>
                        <p className="text-secondary fw-bold small ls-1 mt-2">INITIALIZE YOUR FIRST DISCOVERY FROM THE SEARCH CORE.</p>
                        <Button variant="link" href="/" className="text-primary fw-bold text-decoration-none mt-3">Access Discovery Hub</Button>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {bookings.map((booking, idx) => (
                            <Card key={booking._id} className="glass-card border-white border-opacity-10 shadow-22xl animate-slide-up overflow-hidden mb-4" style={{ animationDelay: `${idx * 0.1}s`, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(30px)' }}>
                                <Card.Body className="p-0">
                                    <Row className="g-0">
                                        <Col md={3} className="d-flex flex-column justify-content-center align-items-center p-4 border-end border-white border-opacity-5" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle mb-3"><Calendar size={32} className="text-primary" /></div>
                                            <div className="text-white fw-900 fs-5">{new Date(booking.checkInDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</div>
                                            <div className="text-secondary x-small fw-800 text-uppercase ls-1">Stay Launch</div>
                                        </Col>
                                        <Col md={9} className="p-4 p-md-5">
                                            <div className="d-flex justify-content-between align-items-start mb-4">
                                                <div>
                                                    <Badge bg={booking.bookingStatus === 'confirmed' ? 'success' : 'danger'} className="bg-opacity-20 text-white border border-white border-opacity-10 px-3 py-1 rounded-pill x-small fw-bold ls-1 mb-2">
                                                        {booking.bookingStatus.toUpperCase()}
                                                    </Badge>
                                                    <h3 className="fw-900 text-white mb-1 ls-tight">{booking.hotelId?.name}</h3>
                                                    <div className="text-secondary small fw-bold d-flex align-items-center gap-2 opacity-75">
                                                        <MapPin size={14} className="text-primary" /> {booking.hotelId?.city} SECTOR
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-secondary x-small fw-800 text-uppercase ls-1 mb-1">Financial Impact</div>
                                                    <div className="text-white fw-900 fs-3">₹{booking.totalAmount.toLocaleString()}</div>
                                                </div>
                                            </div>

                                            <hr className="border-white border-opacity-5 my-4" />

                                            <Row className="g-3 align-items-center">
                                                <Col sm={8}>
                                                    <div className="d-flex gap-4 flex-wrap">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="p-2 rounded-3" style={{ background: 'rgba(0,0,0,0.3)' }}><Users size={16} className="text-secondary" /></div>
                                                            <div className="text-white small fw-bold">{booking.guests} Personnel</div>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="p-2 rounded-3" style={{ background: 'rgba(0,0,0,0.3)' }}><Clock size={16} className="text-secondary" /></div>
                                                            <div className="text-white small fw-bold">ID: #{booking._id.slice(-8).toUpperCase()}</div>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={4} className="text-end">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        {booking.bookingStatus === 'confirmed' && (
                                                            <div className="d-flex gap-2">
                                                                <Button 
                                                                    variant="outline-primary" 
                                                                    size="sm" 
                                                                    className="rounded-pill px-4 fw-800 ls-1 d-flex align-items-center gap-2 border-white border-opacity-10 shadow-lg hover-scale"
                                                                    onClick={() => { setSelectedBooking(booking); setShowReview(true); }}
                                                                >
                                                                    <Activity size={14} /> SHARE INTEL
                                                                </Button>
                                                                <Button 
                                                                    variant="outline-danger" 
                                                                    size="sm" 
                                                                    className="rounded-pill px-4 fw-800 ls-1 d-flex align-items-center gap-2 border-white border-opacity-10 shadow-lg hover-scale"
                                                                    onClick={() => handleCancel(booking._id)}
                                                                >
                                                                    <XCircle size={14} /> CANCEL / REFUND
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>

            {/* Review Broadcast Modal */}
            <Modal show={showReview} onHide={() => setShowReview(false)} centered className="glass-card-modal">
                <div className="glass-card border-white border-opacity-10 p-5 bg-dark">
                    <div className="text-center mb-5">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3"><Star size={32} className="text-primary" /></div>
                        <h3 className="fw-900 text-white mb-2">Strategy Feedback Loop</h3>
                        <p className="text-secondary small fw-bold opacity-75">Broadcast your intelligence on {selectedBooking?.hotelId?.name}</p>
                    </div>

                    <Form>
                        <Form.Group className="mb-4">
                            <label className="text-secondary x-small fw-bold text-uppercase ls-2 mb-3">Vibe Rating</label>
                            <div className="d-flex justify-content-between gap-2">
                                {[1,2,3,4,5].map(star => (
                                    <Button 
                                        key={star}
                                        variant={reviewData.rating >= star ? 'primary' : 'outline-secondary'}
                                        onClick={() => setReviewData({...reviewData, rating: star})}
                                        className="flex-fill py-3 rounded-4 border-white border-opacity-10"
                                    >
                                        <Star size={20} fill={reviewData.rating >= star ? 'currentColor' : 'none'} />
                                    </Button>
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-5">
                            <label className="text-secondary x-small fw-bold text-uppercase ls-2 mb-3">Intel Commentary</label>
                            <Form.Control 
                                as="textarea" 
                                rows={4} 
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                placeholder="Details about asset quality, staff service, and node amenities..."
                                className="glass-card bg-white bg-opacity-5 border-white border-opacity-10 p-4 text-white shadow-none fs-6"
                            />
                        </Form.Group>
                        <div className="d-flex gap-3">
                            <Button variant="outline-secondary" className="flex-fill py-4 rounded-pill fw-bold" onClick={() => setShowReview(false)}>ABORT</Button>
                            <Button variant="primary" className="flex-fill py-4 rounded-pill fw-bold fs-5 ls-1 shadow-2xl" onClick={handlePostReview}>BROADCAST FEEDBACK</Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default CustomerBookings;
