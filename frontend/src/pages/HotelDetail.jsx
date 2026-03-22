import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { MapPin, Wifi, CheckCircle, Star, Calendar, Users, DollarSign, ArrowLeft, Info, Globe, ShieldCheck, Heart, XCircle, Award } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const containerStyle = { width: '100%', height: '450px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' };

const HotelDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState({
        roomTypeId: '', checkInDate: '', checkOutDate: '', guests: 1, couponCode: ''
    });
    const [discountActive, setDiscountActive] = useState(0);
    const [error, setError] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failure'

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    });

    useEffect(() => {
        fetchHotelDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchHotelDetails = async () => {
        try {
            // First Priority: Core Asset Data
            const hotelRes = await api.get(`/hotels/${id}`);
            setHotel(hotelRes.data.hotel);
            setRooms(hotelRes.data.rooms);
            if (hotelRes.data.rooms.length > 0) {
                setBookingDetails(prev => ({ ...prev, roomTypeId: hotelRes.data.rooms[0]._id }));
            }

            // Second Priority: Feedback Hub (Independently handled)
            try {
                const reviewsRes = await api.get(`/reviews/${id}`);
                setReviews(reviewsRes.data);
            } catch (revErr) {
                console.warn('Feedback node unpopulated or offline:', revErr);
                setReviews([]);
            }

        } catch (err) {
            console.error('Core Registry Uplink Failed:', err);
            setError('Strategic asset link severed. Verify connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookingChange = (e) => {
        setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        if (!bookingDetails.roomTypeId || !bookingDetails.checkInDate || !bookingDetails.checkOutDate) return 0;
        const room = rooms.find(r => r._id === bookingDetails.roomTypeId);
        if (!room) return 0;

        const start = new Date(bookingDetails.checkInDate);
        const end = new Date(bookingDetails.checkOutDate);
        const nights = (end - start) / (1000 * 60 * 60 * 24);
        const basePrice = nights > 0 ? nights * room.price : 0;
        return basePrice - (basePrice * (discountActive / 100));
    };

    const handleApplyCoupon = () => {
        if (bookingDetails.couponCode.toUpperCase() === 'STAYSPHERE10') {
            setDiscountActive(10);
            setError('');
        } else {
            setDiscountActive(0);
            setError('Invalid Strategy Code');
        }
    };

    const totalAmount = calculateTotal();

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBookNow = async () => {
        if (!user) return navigate('/login');
        if (totalAmount <= 0) return setError('Invalid dates selected');

        setSubmitting(true);
        setBookingError('');
        setPaymentStatus(null);

        try {

            const res = await api.post('/bookings/create-payment-intent', {
                hotelId: id,
                ...bookingDetails,
                totalAmount
            });

            // ✅ Payment page pe redirect
            navigate("/payment", {
                state: {
                    clientSecret: res.data.clientSecret,
                    paymentIntentId: res.data.paymentIntentId
                }
            });
        } catch (err) {
            console.error('Simulation Error:', err);
            setPaymentStatus('failure');
            const errorMsg = err.response?.data?.message || err.message || 'Payment simulation failed. Please try again.';
            setBookingError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loader-container animate-fade-in"><div className="loader"></div></div>;
    if (error || !hotel) return (
        <Container className="py-5 mt-5">
            <Alert variant="danger" className="glass-card border-danger text-white border-opacity-25 p-5 text-center">
                <XCircle size={48} className="mb-4 text-danger opacity-50" />
                <h3 className="fw-900 mb-2">{error || 'Hotel Asset Missing'}</h3>
                <p className="text-secondary fw-bold small ls-1">THE STRATEGIC REGISTRY COULD NOT LOCATE THIS ASSET ID.</p>
                <Button variant="outline-primary" onClick={() => navigate('/')} className="mt-4 rounded-pill px-5 fw-bold">Return to Explorer</Button>
            </Alert>
        </Container>
    );

    const center = hotel.location?.lat ? { lat: hotel.location.lat, lng: hotel.location.lng } : { lat: 28.6139, lng: 77.2090 };

    return (
        <div className="hotel-detail-page pb-5 animate-fade-in">
            {/* Immersive Hero Section */}
            <div className="detail-hero position-relative mb-5">
                <div className="hero-img-container" style={{ height: '70vh', position: 'relative', overflow: 'hidden' }}>
                    <img
                        src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=1920&q=80'}
                        alt={hotel.name}
                        className="w-100 h-100 object-fit-cover"
                        style={{ filter: 'brightness(0.6)' }}
                    />
                    <div className="hero-overlay position-absolute bottom-0 start-0 w-100 p-5" style={{ background: 'linear-gradient(to top, var(--bg-main), transparent)' }}>
                        <Container>
                            <div className="animate-slide-up">
                                <Button variant="link" onClick={() => navigate(-1)} className="text-white p-0 mb-4 d-flex align-items-center gap-2 text-decoration-none opacity-75 hover-opacity-100 transition-all">
                                    <ArrowLeft size={20} /> Return to Explorations
                                </Button>
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <Badge bg="primary" className="bg-opacity-25 text-white border border-white border-opacity-10 px-3 py-2 rounded-pill ls-1 fw-bold">LUXURY COLLECTION</Badge>
                                    <div className="d-flex align-items-center gap-1 text-warning"><Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /></div>
                                </div>
                                <h1 className="display-2 fw-900 text-white mb-3 ls-tight">{hotel.name}</h1>
                                <p className="fs-5 text-secondary d-flex align-items-center gap-2 mb-0 fw-bold opacity-75">
                                    <MapPin size={22} className="text-primary" /> {hotel.address}, {hotel.city} SECTOR
                                </p>
                            </div>
                        </Container>
                    </div>
                </div>
            </div>

            <Container className="position-relative" style={{ zIndex: 10, marginTop: '-100px' }}>
                <Row className="g-5">
                    <Col lg={8}>
                        {/* Elite Info Section */}
                        <div className="glass-card p-5 mb-5 shadow-22xl animate-slide-up-delay border-white border-opacity-10">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-4"><Info size={24} className="text-primary" /></div>
                                <h3 className="fw-900 text-white mb-0">Asset Dossier</h3>
                            </div>
                            <p className="text-secondary fs-5 lh-lg mb-5 opacity-90">
                                {hotel.description || 'Indulge in an extraordinary stay where every detail is tailored to perfection. Experience the pinnacle of hospitality in our most exclusive residence.'}
                            </p>

                            <div className="glass-card p-4 mb-4 border-white border-opacity-5">
                                <h4 className="fw-900 text-white mb-4">Strategic Amenities</h4>
                                <div className="d-flex flex-wrap gap-3">
                                    {hotel.amenities && hotel.amenities.length > 0 ? (
                                        hotel.amenities.map((item, idx) => (
                                            <div key={idx} className="glass-card bg-primary bg-opacity-5 px-4 py-2 d-flex align-items-center gap-2 rounded-pill border-white border-opacity-10 hover-up transition-all">
                                                <CheckCircle size={14} className="text-primary" />
                                                <span className="text-white small fw-bold">{item}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-secondary small opacity-50 fw-bold italic">No amenities documented in our registry for this asset.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tactical Location Node */}
                        <div className="glass-card p-5 border-white border-opacity-10 animate-fade-in-delay mb-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="bg-success bg-opacity-10 p-3 rounded-4"><Globe size={24} className="text-success" /></div>
                                <h3 className="fw-900 text-white mb-0">Geographic Deployment</h3>
                            </div>
                            <div className="overflow-hidden rounded-5 shadow-22xl border border-white border-opacity-10 position-relative" style={{ height: '450px' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(0.9)' }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.address + ' ' + hotel.city)}&output=embed`}
                                ></iframe>
                                <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none border border-white border-opacity-5 rounded-5" style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)' }}></div>
                            </div>
                        </div>

                        {/* Verified Feedback Loop */}
                        <div className="glass-card p-5 border-white border-opacity-10 animate-fade-in-delay">
                            <div className="d-flex align-items-center justify-content-between mb-5">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-warning bg-opacity-10 p-3 rounded-4"><Star size={24} className="text-warning" fill="currentColor" /></div>
                                    <h3 className="fw-900 text-white mb-0">Verified Testimonials</h3>
                                </div>
                                <div className="text-end">
                                    <div className="display-6 fw-900 text-white mb-0">{hotel.avgRating || '0.0'}</div>
                                    <div className="text-secondary x-small fw-bold ls-1 uppercase">{hotel.totalReviews || '0'} REVIEWS TRACKED</div>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-4">
                                {reviews.length > 0 ? reviews.map(review => (
                                    <div key={review._id} className="glass-card bg-white bg-opacity-5 p-4 rounded-4 border-white border-opacity-5">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-primary bg-opacity-10 p-2 px-3 rounded-circle text-primary fw-900 fs-5">{review.userName.charAt(0)}</div>
                                                <div>
                                                    <div className="text-white fw-bold">{review.userName}</div>
                                                    <div className="text-secondary x-small fw-bold opacity-50 ls-1 font-monospace uppercase">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <Badge bg="warning" className="bg-opacity-10 text-warning px-3 py-2 rounded-pill small border-0 font-monospace">
                                                <Star size={12} className="me-1" fill="currentColor" /> {review.rating}.0
                                            </Badge>
                                        </div>
                                        <p className="text-secondary mb-0 fw-bold opacity-75">{review.comment}</p>
                                    </div>
                                )) : (
                                    <div className="text-center py-4 bg-white bg-opacity-5 rounded-4 border-white border-opacity-5 border-dashed">
                                        <p className="text-secondary mb-0 fw-bold italic opacity-50">No strategic feedback recorded for this asset yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>

                    <Col lg={4}>
                        {/* Premium Booking Pod */}
                        <div className="sticky-top animate-slide-up-delay" style={{ top: '120px' }}>
                            <Card className="glass-card border-white border-opacity-10 shadow-22xl overflow-hidden overflow-visible">
                                <Card.Body className="p-5">
                                    <div className="d-flex justify-content-between align-items-center mb-5">
                                        <h4 className="fw-900 text-white mb-0">Secure Stay</h4>
                                        <div className="bg-primary bg-opacity-10 px-3 py-1 rounded-pill text-primary x-small fw-800 ls-1">AVAILABILITY: HIGH</div>
                                    </div>

                                    {bookingError && <Alert variant="danger" className="glass-card border-danger text-white py-3 rounded-4 mb-4">{bookingError}</Alert>}

                                    <Form>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="text-white x-small fw-900 text-uppercase ls-2 ms-1 mb-2 opacity-90">Inventory Tier</Form.Label>
                                            <Form.Select name="roomTypeId" value={bookingDetails.roomTypeId} onChange={handleBookingChange} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px', padding: '15px', fontWeight: 'bold' }}>
                                                {rooms.length > 0 ? (
                                                    rooms.map(room => (
                                                        <option key={room._id} value={room._id} style={{ background: '#0f172a', color: '#fff' }}>
                                                            {room.type.toUpperCase()} — ₹{room.price.toLocaleString()}/night
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled style={{ background: '#0f172a', color: '#fff' }}>Awaiting Room Allocation...</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>

                                        <Row className="g-3 mb-4">
                                            <Col xs={6}>
                                                <Form.Label className="text-white x-small fw-900 text-uppercase ls-2 ms-1 mb-2 opacity-90 d-flex align-items-center gap-2">
                                                    <Calendar size={12} className="text-primary" /> Check-in
                                                </Form.Label>
                                                <div className="position-relative">
                                                    <Form.Control
                                                        type="date"
                                                        name="checkInDate"
                                                        onChange={handleBookingChange}
                                                        style={{ background: '#090f1a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '14px', padding: '14px', fontWeight: 'bold', fontSize: '13px' }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <Form.Label className="text-white x-small fw-900 text-uppercase ls-2 ms-1 mb-2 opacity-90 d-flex align-items-center gap-2">
                                                    <Calendar size={12} className="text-primary" /> Check-out
                                                </Form.Label>
                                                <div className="position-relative">
                                                    <Form.Control
                                                        type="date"
                                                        name="checkOutDate"
                                                        onChange={handleBookingChange}
                                                        style={{ background: '#090f1a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '14px', padding: '14px', fontWeight: 'bold', fontSize: '13px' }}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-5">
                                            <Form.Label className="text-white x-small fw-900 text-uppercase ls-2 ms-1 mb-3 d-flex align-items-center gap-2">
                                                <Award size={14} className="text-primary" /> 🎁 EXCLUSIVE PROMOTION CODE
                                            </Form.Label>
                                            <div className="d-flex gap-3">
                                                <Form.Control
                                                    type="text"
                                                    name="couponCode"
                                                    placeholder="e.g. STAYSPHERE10"
                                                    value={bookingDetails.couponCode}
                                                    onChange={handleBookingChange}
                                                    style={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.5)', color: '#fff', borderRadius: '16px', padding: '15px' }}
                                                />
                                                <Button variant="primary" className="rounded-4 px-4 fw-900 ls-1 shadow-lg" onClick={handleApplyCoupon}>APPLY</Button>
                                            </div>
                                            {discountActive > 0 ? (
                                                <p className="text-success small fw-900 mt-3 ms-1 animate-pulse-slow d-flex align-items-center gap-2">
                                                    <CheckCircle size={14} /> STRATEGY ACTIVATED: 10% SAVINGS
                                                </p>
                                            ) : (
                                                <p className="text-white x-small fw-bold mt-2 ms-1 opacity-50 italic">Use code STAYSPHERE10 for special discount.</p>
                                            )}
                                        </Form.Group>

                                        <div className="glass-card bg-primary bg-opacity-10 p-4 rounded-4 border-primary border-opacity-20 mb-5 d-flex justify-content-between align-items-center shadow-inner">
                                            <div>
                                                <div className="text-white x-small fw-900 text-uppercase ls-1 opacity-75">Estimated Worth</div>
                                                <h3 className="fw-900 text-white mb-0 mt-1 font-monospace">
                                                    {discountActive > 0 && <span className="text-white text-decoration-line-through me-2 fs-6 opacity-30">₹{(totalAmount / (1 - discountActive / 100)).toLocaleString()}</span>}
                                                    ₹ {totalAmount.toLocaleString()}
                                                </h3>
                                            </div>
                                            <div className="text-primary animate-pulse-slow"><DollarSign size={28} /></div>
                                        </div>

                                        {!user ? (
                                            <Button
                                                as={Link}
                                                to="/login"
                                                className="w-100 py-4 rounded-pill fs-5 fw-900 ls-1 shadow-22xl d-flex align-items-center justify-content-center gap-3 transition-all transform hover-scale btn-warning text-dark border-0"
                                            >
                                                <Users size={24} /> LOGIN TO INITIALIZE
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleBookNow}
                                                disabled={totalAmount <= 0 || submitting}
                                                className={`w-100 py-4 rounded-pill fs-5 fw-900 ls-1 shadow-22xl d-flex align-items-center justify-content-center gap-3 transition-all transform hover-scale ${paymentStatus === 'success' ? 'btn-success' : paymentStatus === 'failure' ? 'btn-danger' : 'btn-primary'}`}
                                            >
                                                {submitting ? (
                                                    <><Spinner size="sm" animation="border" /> PROCESSING PAYMENT...</>
                                                ) : paymentStatus === 'success' ? (
                                                    <><CheckCircle size={24} /> BOOKING CONFIRMED</>
                                                ) : paymentStatus === 'failure' ? (
                                                    <><XCircle size={24} /> PAYMENT FAILED</>
                                                ) : (
                                                    <><ShieldCheck size={24} /> INITIALIZE RESERVATION</>
                                                )}
                                            </Button>
                                        )}

                                        <p className="text-center text-secondary small mt-4 opacity-50 fw-bold">Payments secured by StaySphere Protocol.</p>
                                    </Form>
                                </Card.Body>
                            </Card>

                            <div className="mt-4 px-3">
                                <div className="d-flex align-items-center gap-2 text-secondary small fw-bold opacity-75">
                                    <Heart size={14} className="text-secondary" /> 124 Guests loved this property last week.
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const darkMapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1e293b" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#1e293b" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca3af" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
];

export default HotelDetail;
