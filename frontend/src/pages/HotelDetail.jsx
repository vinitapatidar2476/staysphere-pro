import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card, Spinner, Form, Carousel } from 'react-bootstrap';
import { MapPin, Star, Wifi, Coffee, Music, Car, Dumbbell, Info, Globe, ShieldCheck, CheckCircle, ArrowLeft, ArrowRight, Zap, Award, Layers, Clock, Shield, Coins, Share2, Heart, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

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
    const [bookingLoading, setBookingLoading] = useState(false);
    const [discountActive, setDiscountActive] = useState(0);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await api.get(`/hotels/${id}`);
                // API returns { hotel: {...}, rooms: [...] }
                const hotelData = res.data.hotel;
                const roomsData = res.data.rooms;
                
                setHotel(hotelData);
                // We'll treat roomsData as hotel.roomTypes internally for the UI
                if (roomsData?.length > 0) {
                    setBookingDetails(prev => ({ ...prev, roomTypeId: roomsData[0]._id }));
                }
                setRooms(roomsData || []); // Add new state for rooms if needed or use hotelData

                const revRes = await api.get(`/reviews/${id}`);
                setReviews(revRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleBookNow = async () => {
        if (!user) return navigate('/login');
        if (!bookingDetails.roomTypeId || !bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
            return alert("RESERVATION INCOMPLETE: Please ensure Check-in, Check-out, and Asset Tier are fully synchronized.");
        }

        setBookingLoading(true);
        try {
            const selectedRoom = rooms.find(r => r._id === bookingDetails.roomTypeId);
            const nights = (new Date(bookingDetails.checkOutDate) - new Date(bookingDetails.checkInDate)) / (1000 * 60 * 60 * 24);
            if (nights <= 0) throw new Error("TIMELINE ERROR: Check-out must follow check-in node.");
            
            const totalAmount = selectedRoom.price * nights;

            const res = await api.post('/bookings/create-payment-intent', {
                hotelId: id,
                ...bookingDetails,
                totalAmount,
                discount: discountActive
            });

            navigate("/payment", {
                state: {
                    clientSecret: res.data.clientSecret,
                    paymentIntentId: res.data.paymentIntentId,
                    hotelName: hotel.name,
                    roomType: selectedRoom.type,
                    amount: totalAmount
                }
            });
        } catch (err) {
            alert(err.message || "SYNC ERROR: FAILED TO INITIATE SECURE CHANNEL.");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-slate-950">
            <Spinner animation="grow" variant="primary" className="mb-4" />
            <div className="text-primary fw-900 ls-2 uppercase small animate-pulse-soft">SYNCHRONIZING ASSET DOSSIER...</div>
        </div>
    );

    if (!hotel) return (
        <Container className="py-20 text-center"><h1 className="text-white opacity-40">ASSET NODE NOT FOUND.</h1></Container>
    );

    const selectedRoom = rooms?.find(r => r._id === bookingDetails.roomTypeId);
    
    const getAmenityIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('wifi')) return <Wifi size={18} />;
        if (lowerName.includes('pool')) return <Globe size={18} />; // Placeholder as Pool not in lucide imports yet
        if (lowerName.includes('gym') || lowerName.includes('fitness')) return <Dumbbell size={18} />;
        if (lowerName.includes('coffee') || lowerName.includes('breakfast')) return <Coffee size={18} />;
        if (lowerName.includes('bar') || lowerName.includes('drink')) return <Music size={18} />;
        if (lowerName.includes('parking')) return <Car size={18} />;
        return <CheckCircle size={18} />;
    };

    return (
        <div className="hotel-detail-page bg-slate-950 pb-5 animate-fade-in">
            <Container>
                {/* Tactical Navigation Bar */}
                <div className="d-flex justify-content-between align-items-center mb-5 animate-slide-up">
                    <button onClick={() => navigate(-1)} className="btn-outline-premium rounded-pill px-4 py-2 border-primary border-opacity-20 d-flex align-items-center gap-2 hover-glow transition-all">
                        <ArrowLeft size={16} /> ABORT DOSSIER
                    </button>
                    <div className="d-flex align-items-center gap-2">
                        <button className="social-pill rounded-full bg-white bg-opacity-5 p-3 hover-text-primary transition-all border-0"><Share2 size={18} /></button>
                        <button className="social-pill rounded-full bg-white bg-opacity-5 p-3 hover-text-danger transition-all border-0"><Heart size={18} /></button>
                    </div>
                </div>

                <Row className="g-5">
                    <Col lg={8}>
                        {/* Immersive Cinematic Display */}
                        <div className="asset-gallery mb-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="position-relative overflow-hidden rounded-5 shadow-22xl border border-white border-opacity-5" style={{ height: '560px' }}>
                                <Carousel fade indicators={false} className="w-100 h-100">
                                    {hotel.images?.map((img, idx) => (
                                        <Carousel.Item key={idx} className="w-100 h-100">
                                            <div className="w-100 h-100">
                                                <img src={img} alt={`${hotel.name} ${idx}`} className="w-100 h-100 object-fit-cover shadow-inner" style={{ filter: 'brightness(1.0)' }} />
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                    {(!hotel.images || hotel.images.length === 0) && (
                                        <Carousel.Item className="w-100 h-100">
                                            <img src="https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=1920" alt="placeholder" className="w-100 h-100 object-fit-cover" />
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                                <div className="position-absolute top-0 start-0 w-100 p-5 px-md-5 pt-md-10" style={{ background: 'linear-gradient(to bottom, rgba(2,6,23,0.9), transparent)', zIndex: 10 }}>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <Badge bg="primary" className="fw-900 rounded-pill px-4 py-2 ls-1 border border-primary border-opacity-20 shadow-lg">LUXURY NODE</Badge>
                                        <div className="d-flex align-items-center gap-1 text-warning animate-pulse-soft">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    <h1 className="display-4 fw-800 text-white ls-tight mb-2 uppercase">{hotel?.name || 'Asset Name Pending'}</h1>
                                    <div className="d-flex align-items-center gap-3 text-secondary fw-800 ls-wide fs-6 max-w-lg mb-0 mt-4 opacity-90">
                                        <div className="d-flex align-items-center gap-2 text-white">
                                            <MapPin className="text-primary" size={20} /> {(hotel?.city || 'SECURE').toUpperCase()}
                                        </div>
                                        <div className="text-primary opacity-30">|</div>
                                        <div className="small ls-1">{hotel?.address || 'Operational Sector Unassigned'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tactical Intelligence Briefing */}
                        <div className="glass-panel p-5 rounded-5 border-white border-opacity-5 mb-5 shadow-22xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="d-flex align-items-center gap-3 mb-5">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-4"><Layers size={24} className="text-primary" strokeWidth={2.5} /></div>
                                <div>
                                    <h3 className="fw-900 text-white mb-0 ls-tight">Asset Dossier</h3>
                                    <span className="text-secondary x-small fw-800 ls-1 uppercase opacity-40">Intelligence Overview</span>
                                </div>
                            </div>
                            
                            <p className="text-white opacity-80 fs-5 lh-lg mb-5 font-outfit" style={{ fontWeight: '400' }}>
                                {hotel.description || 'Elevating the standard of high-vibe living nodes. This asset marks a strategic point in the global stay network, optimized for security, privacy, and supreme comfort.'}
                            </p>

                            <Row className="g-4 pt-4 border-top border-white border-opacity-5">
                                <Col sm={4}>
                                    <div className="d-flex flex-column">
                                        <div className="text-secondary x-small fw-900 ls-2 uppercase mb-2">Sync Status</div>
                                        <div className="d-flex align-items-center gap-2 text-success fw-900 fs-5">
                                            <div className="bg-success rounded-full" style={{width: '10px', height: '10px'}}></div> LIVE FEED
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <div className="d-flex flex-column">
                                        <div className="text-secondary x-small fw-900 ls-2 uppercase mb-2">Vibe Verification</div>
                                        <div className="text-white fw-900 fs-5">ELITE GRADE AA</div>
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <div className="d-flex flex-column text-end">
                                        <div className="text-secondary x-small fw-900 ls-2 uppercase mb-2">Identity Syncs</div>
                                        <div className="text-white fw-900 fs-5">5,200+ COMPLETED</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Amenities Sync */}
                        <div className="glass-panel p-5 rounded-5 border-white border-opacity-5 mb-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <h4 className="fw-900 text-white mb-5 uppercase ls-wide fs-5">Operational Amenities</h4>
                            <div className="d-flex flex-wrap gap-4">
                                {hotel.amenities?.map((amenity, i) => (
                                    <div key={i} className="glass-card p-4 rounded-4 d-flex align-items-center gap-3 hover-glow transition-all" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                        <div className="text-primary opacity-80">{getAmenityIcon(amenity)}</div>
                                        <span className="fw-900 ls-1 x-small uppercase text-white">{(amenity || '').toUpperCase()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Location Intelligence */}
                        <div className="glass-panel p-5 rounded-5 border-white border-opacity-5 mb-5 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                            <div className="d-flex align-items-center justify-content-between mb-5">
                                <h4 className="fw-900 text-white mb-0 uppercase ls-wide fs-5">Sector Deployment Map</h4>
                                <Badge bg="success" className="bg-opacity-10 text-success fw-900 ls-1 border border-success border-opacity-20 px-3 py-2 rounded-4">SECURE DEPLOYMENT</Badge>
                            </div>
                            <div className="overflow-hidden rounded-5 shadow-3xl border border-white border-opacity-5" style={{ height: '420px', filter: 'invert(1) hue-rotate(180deg) brightness(0.9)' }}>
                                <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.address + ' ' + hotel.city)}&output=embed`}></iframe>
                            </div>
                        </div>
                    </Col>

                    <Col lg={4}>
                        {/* Reservation Initialization Panel */}
                        <div className="sticky-top" style={{ top: '120px' }}>
                            <Card className="glass-panel p-4 p-xl-5 border-primary border-opacity-20 rounded-5 shadow-22xl animate-slide-up" style={{ animationDelay: '0.2s', background: 'rgba(15, 23, 42, 0.95)' }}>
                                <div className="text-center mb-5 pb-2">
                                    <div className="text-secondary x-small fw-900 ls-3 uppercase mb-3 opacity-60">Initializing Reservation Protocol</div>
                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                        <span className="display-5 fw-900 text-white ls-tight">₹{selectedRoom?.price.toLocaleString() || '---'}</span>
                                        <span className="text-secondary fw-800 ls-1 small mt-2 uppercase">/Sync Cycle</span>
                                    </div>
                                </div>

                                <Form className="d-flex flex-column gap-4">
                                    <Form.Group>
                                        <label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Asset Tier</label>
                                        <Form.Select 
                                            value={bookingDetails.roomTypeId} onChange={(e) => setBookingDetails({...bookingDetails, roomTypeId: e.target.value})}
                                            className="border-white border-opacity-10 p-3 text-white shadow-none rounded-4 fs-6 fw-800 focus-within-primary"
                                            style={{ background: 'rgba(15, 23, 42, 0.95)' }}
                                        >
                                            {rooms?.map(r => <option key={r._id} value={r._id} className="bg-slate-900">{(r.type || 'Standard').toUpperCase()} NODE</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Row className="g-3">
                                        <Col xs={6}>
                                            <Form.Group>
                                                <label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Sync Start</label>
                                                <Form.Control type="date" value={bookingDetails.checkInDate} onChange={(e) => setBookingDetails({...bookingDetails, checkInDate: e.target.value})} className="border-white border-opacity-10 p-3 text-white shadow-none rounded-4 fw-800" style={{ background: 'rgba(15, 23, 42, 0.95)' }} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={6}>
                                            <Form.Group>
                                                <label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Sync End</label>
                                                <Form.Control type="date" value={bookingDetails.checkOutDate} onChange={(e) => setBookingDetails({...bookingDetails, checkOutDate: e.target.value})} className="border-white border-opacity-10 p-3 text-white shadow-none rounded-4 fw-800" style={{ background: 'rgba(15, 23, 42, 0.95)' }} />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mt-4">
                                        <label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Coupon Authorization</label>
                                        <Form.Control type="text" placeholder="SEC-XXXX-XXXX" value={bookingDetails.couponCode} onChange={(e) => setBookingDetails({...bookingDetails, couponCode: e.target.value})} className="border-white border-opacity-10 p-3 text-white shadow-none rounded-4 fw-800" style={{ background: 'rgba(15, 23, 42, 0.95)' }} />
                                    </Form.Group>

                                    <Form.Group>
                                        <label className="text-white x-small fw-900 ls-2 uppercase ms-1 mb-3">Personnel Capacity</label>
                                        <div className="d-flex align-items-center glass-card bg-white bg-opacity-5 rounded-4 p-1">
                                            <Button variant="link" className="text-white hover-bg-primary hover-bg-opacity-20 p-3 border-0 transition-all rounded-4" onClick={() => setBookingDetails({...bookingDetails, guests: Math.max(1, bookingDetails.guests - 1)})} disabled={bookingDetails.guests <= 1}>-</Button>
                                            <span className="flex-fill text-center fw-900 fs-5 text-white">{bookingDetails.guests}</span>
                                            <Button variant="link" className="text-white hover-bg-primary hover-bg-opacity-20 p-3 border-0 transition-all rounded-4" onClick={() => setBookingDetails({...bookingDetails, guests: Math.min(10, bookingDetails.guests + 1)})}>+</Button>
                                        </div>
                                    </Form.Group>

                                    <div className="mt-4 pt-4 border-top border-white border-opacity-5">
                                        <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                                            <span className="text-secondary small fw-bold uppercase">Sync Duration</span>
                                            <span className="text-white fw-900">{(new Date(bookingDetails.checkOutDate) - new Date(bookingDetails.checkInDate)) / (1000 * 60 * 60 * 24) || 0} Cycles</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-5 px-1">
                                            <span className="text-secondary small fw-bold uppercase">Network Fee</span>
                                            <span className="text-white fw-900">INCLUDED</span>
                                        </div>
                                        
                                        <Button 
                                            className="btn-premium w-100 py-4 rounded-pill shadow-22xl transform transition-all fs-5 ls-wide group"
                                            disabled={bookingLoading}
                                            onClick={handleBookNow}
                                        >
                                            {bookingLoading ? <><Spinner size="sm" className="me-2" /> SYNCHRONIZING...</> : <><Zap size={20} fill="currentColor" /> BOOK NODE NOW <ArrowRight size={20} className="ms-auto group-hover:translate-x-1 transition-all" /></>}
                                        </Button>
                                    </div>
                                </Form>
                                
                                <p className="text-center x-small text-secondary fw-bold mt-4 opacity-40 uppercase ls-1 ls-wide">100% SECURE RESERVATION CHANNEL</p>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .ls-3 { letter-spacing: 0.3em; }
                .focus-within-primary:focus-within { border-color: var(--primary) !important; background: rgba(99,102,241,0.08) !important; }
                .dropdown-menu-dark { --bs-dropdown-bg: #0f172a; --bs-dropdown-border-color: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    );
};

export default HotelDetail;
