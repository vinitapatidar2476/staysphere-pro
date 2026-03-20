import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Badge, Dropdown, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Plane, Globe, Shield, ArrowRight, Zap, Award, Filter, DollarSign, Wifi, Coffee, Music, Car, Dumbbell, X, Activity, HardDrive, Cpu } from 'lucide-react';
import api from '../services/api';

const amenityList = ["WiFi", "Swimming Pool", "Parking", "Gym", "Restaurant", "Bar", "Spa"];

const Home = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            let url = `/hotels?search=${searchQuery}&city=${cityFilter}`;
            if (priceFilter) url += `&minPrice=${priceFilter}`;
            if (ratingFilter) url += `&rating=${ratingFilter}`;
            if (selectedAmenities.length > 0) url += `&amenity=${selectedAmenities.join(',')}`;

            const res = await api.get(url);
            setHotels(res.data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchHotels();
    };

    const toggleAmenity = (amenity) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    const clearFilters = () => {
        setPriceFilter('');
        setRatingFilter('');
        setSelectedAmenities([]);
        setSearchQuery('');
        setCityFilter('');
        fetchHotels();
    };

    return (
        <div className="home-page pb-5 animate-fade-in">
            {/* Cinematic Hero Section */}
            <section className="search-banner overflow-hidden position-relative py-5">
                <div className="hero-glow-1"></div>
                <div className="hero-glow-2"></div>
                <Container className="position-relative py-5 mt-5" style={{ zIndex: 10 }}>
                    <div className="text-center">
                        <Badge bg="primary" className="bg-opacity-10 text-primary px-4 py-2 rounded-pill fw-900 ls-2 mb-4 animate-float border border-primary border-opacity-20">
                            <Award size={14} className="me-2" /> CORE LUXURY NETWORK
                        </Badge>
                        <h1 className="display-1 fw-900 mb-4 gradient-text ls-tight">
                            Bespoke Travel<span className="text-white">.</span> <br /> 
                            <span className="text-white">Limitless</span> Discoveries.
                        </h1>
                        <p className="text-secondary fw-bold fs-5 mb-5 opacity-75 ls-1">Architecting the world's most exclusive stay nodes for high-value personnel.</p>
                        
                        {/* Hero Stats */}
                        <Row className="justify-content-center g-4 mt-5 mb-5 pt-4">
                            <Col md={3}>
                                <div className="hero-stats-badge">
                                    <div className="text-primary fw-900 fs-2 mb-1">12K+</div>
                                    <div className="text-secondary x-small fw-900 ls-2 uppercase">Global Assets</div>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="hero-stats-badge">
                                    <div className="text-primary fw-900 fs-2 mb-1">98.4%</div>
                                    <div className="text-secondary x-small fw-900 ls-2 uppercase">Safety Rating</div>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="hero-stats-badge">
                                    <div className="text-primary fw-900 fs-2 mb-1">0.5ms</div>
                                    <div className="text-secondary x-small fw-900 ls-2 uppercase">Sync Speed</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>

            {/* Premium Search & Filter Engine */}
            <Container className="position-relative mb-5" style={{ zIndex: 20, marginTop: '-60px' }}>
                <div className="glass-card p-4 p-md-5 shadow-22xl border-white border-opacity-10">
                    <Form onSubmit={handleSearch}>
                        <Row className="g-4 align-items-end">
                            <Col lg={4}>
                                <Form.Label className="text-secondary x-small fw-bold text-uppercase ls-2 ms-1 mb-2">Destination Node</Form.Label>
                                <div className="d-flex align-items-center gap-3 p-3 glass-card bg-white bg-opacity-5 border-white border-opacity-10">
                                    <Search size={18} className="text-primary" />
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Search hotel or sector..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-0 p-0 text-white shadow-none fs-6"
                                    />
                                </div>
                            </Col>
                            <Col lg={3}>
                                <Form.Label className="text-secondary x-small fw-bold text-uppercase ls-2 ms-1 mb-2">Regional Sector</Form.Label>
                                <div className="d-flex align-items-center gap-3 p-3 glass-card bg-white bg-opacity-5 border-white border-opacity-10">
                                    <MapPin size={18} className="text-secondary" />
                                    <Form.Control 
                                        type="text" 
                                        placeholder="City (e.g. Jaipur)" 
                                        value={cityFilter}
                                        onChange={(e) => setCityFilter(e.target.value)}
                                        className="bg-transparent border-0 p-0 text-white shadow-none fs-6"
                                    />
                                </div>
                            </Col>
                            <Col lg={2}>
                                <Button 
                                    variant="outline-secondary" 
                                    className="w-100 py-3 rounded-4 border-white border-opacity-10 text-white fw-900 ls-1 d-flex align-items-center justify-content-center gap-2 hover-scale transform"
                                    onClick={() => setShowFilters(true)}
                                >
                                    <Filter size={18} /> FILTERS
                                </Button>
                            </Col>
                            <Col lg={3}>
                                <Button type="submit" className="w-100 btn-primary py-3 rounded-4 fw-900 ls-1 shadow-lg d-flex align-items-center justify-content-center gap-2">
                                    <Zap size={20} fill="currentColor" /> INITIATE SEARCH
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Container>

            {/* Filter Offcanvas */}
            <Offcanvas 
                show={showFilters} 
                onHide={() => setShowFilters(false)} 
                placement="end" 
                className="filter-offcanvas text-white border-0" 
                style={{ width: '420px', background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(20px)' }}
            >
                <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-white border-opacity-10 px-4 py-4">
                    <Offcanvas.Title className="fw-900 ls-tight fs-3">Refine Discovery</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-4 custom-scrollbar">
                    <div className="mb-5">
                        <label className="text-secondary x-small fw-900 text-uppercase ls-2 mb-3">Price Ceiling</label>
                        <div className="position-relative">
                            <DollarSign size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary" style={{ zIndex: 5 }} />
                            <Form.Select 
                                value={priceFilter} 
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="bg-white bg-opacity-5 border-white border-opacity-10 p-3 ps-5 text-white shadow-none rounded-4 fs-6"
                            >
                                <option value="">All Price Ranges</option>
                                <option value="5000">Under ₹5,000</option>
                                <option value="10000">Under ₹10,000</option>
                                <option value="25000">Under ₹25,000</option>
                                <option value="50000">Under ₹50,000</option>
                            </Form.Select>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="text-secondary x-small fw-900 text-uppercase ls-2 mb-3">Minimum Vibe Score</label>
                        <div className="d-flex gap-2">
                            {[3, 4, 4.5].map(r => (
                                <Button 
                                    key={r}
                                    variant={ratingFilter == r ? 'primary' : 'outline-secondary'}
                                    className={`flex-fill py-3 rounded-4 fw-800 transition-all ${ratingFilter == r ? 'shadow-lg border-primary' : 'border-white border-opacity-10 text-secondary'}`}
                                    onClick={() => setRatingFilter(r)}
                                >
                                    {r}+ <Star size={16} className="ms-1" fill={ratingFilter == r ? 'currentColor' : 'none'} />
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="text-secondary x-small fw-900 text-uppercase ls-2 mb-3">Strategic Amenities</label>
                        <div className="d-flex flex-wrap gap-2">
                            {amenityList.map(a => (
                                <div 
                                    key={a}
                                    onClick={() => toggleAmenity(a)}
                                    className={`amenity-badge ${selectedAmenities.includes(a) ? 'active' : ''}`}
                                >
                                    {a}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 d-flex gap-3 pt-4 border-top border-white border-opacity-10">
                        <Button 
                            variant="outline-danger" 
                            className="flex-fill py-3 rounded-pill fw-800 border-opacity-25" 
                            onClick={clearFilters}
                        >
                            Reset
                        </Button>
                        <Button 
                            variant="primary" 
                            className="flex-fill py-3 rounded-pill fw-800 shadow-lg" 
                            onClick={() => { fetchHotels(); setShowFilters(false); }}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Collection Grid */}
            <Container className="py-5">
                <div className="d-flex flex-column align-items-center mb-5 text-center">
                    <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-1 rounded-pill fw-900 ls-2 mb-3 border border-primary border-opacity-10">
                        DISCOVERY CORE
                    </Badge>
                    <h2 className="display-4 fw-900 text-white mb-2 ls-tight">The Elite Collection<span className="text-primary">.</span></h2>
                    <p className="text-secondary fw-bold opacity-50 ls-1">TOP-RATED ASSETS SYNCED IN REAL-TIME</p>
                </div>

                {loading ? (
                    <div className="text-center py-5"><div className="loader"></div></div>
                ) : hotels.length === 0 ? (
                    <div className="text-center py-5 glass-card rounded-5 border-dashed border-white border-opacity-10 py-5">
                        <Globe size={80} strokeWidth={1} className="text-primary opacity-25 mb-4 animate-pulse-slow" />
                        <h3 className="fw-900 text-white">No assets found in this sector.</h3>
                        <p className="text-secondary fw-bold small opacity-50 ls-1 mt-2 mb-4">ADJUST PARAMETERS OR EXPAND GEOGRAPHIC RANGE.</p>
                        <Button variant="primary" onClick={clearFilters} className="rounded-pill px-5 py-3 fw-900 ls-1">Reset All System Filters</Button>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-5">
                        {hotels.map(hotel => (
                            <Col key={hotel._id}>
                                <Card className="hotel-card border-0 h-100 animate-slide-up bg-transparent">
                                    <div className="hotel-img-wrapper rounded-5 overflow-hidden position-relative shadow-22xl" style={{ height: '320px' }}>
                                        <Card.Img 
                                            variant="top" 
                                            src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=800&q=80'} 
                                            alt={hotel.name}
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                        <div className="price-tag glass-card border-white border-opacity-10 bg-dark bg-opacity-80 px-4 py-2">
                                            <span className="text-primary fw-900 fs-5">₹{hotel.minPrice ? hotel.minPrice.toLocaleString() : '8,500'}</span>
                                            <span className="x-small opacity-50 ms-1 fw-bold ls-1">/UNIT</span>
                                        </div>
                                        <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                            <Badge bg="primary" className="fw-900 px-3 py-2 rounded-4 shadow-lg border border-primary border-opacity-20 d-flex align-items-center gap-2" style={{width: 'fit-content'}}>
                                                <Star size={12} fill="currentColor" /> {hotel.avgRating || '4.8'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Card.Body className="p-4 d-flex flex-column pt-5">
                                        <div className="d-flex align-items-center gap-2 text-secondary x-small fw-900 ls-2 uppercase opacity-75 mb-3">
                                            <MapPin size={12} className="text-primary" /> {hotel.city} SECTOR
                                        </div>
                                        <Card.Title className="fw-900 fs-3 mb-3 text-white ls-tight">{hotel.name}</Card.Title>
                                        <div className="d-flex flex-wrap gap-2 mb-5">
                                            {hotel.amenities?.slice(0, 3).map(a => (
                                                <Badge key={a} bg="white" className="bg-opacity-5 text-secondary border border-white border-opacity-5 p-2 px-3 fw-800 ls-1 x-small">{a.toUpperCase()}</Badge>
                                            ))}
                                        </div>
                                        <Button 
                                            as={Link} 
                                            to={`/hotel/${hotel._id}`} 
                                            className="mt-auto btn-primary w-100 fw-900 py-4 rounded-pill ls-2 shadow-22xl border-0"
                                        >
                                            VIEW DOSSIER <ArrowRight size={18} className="ms-2" />
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* Hyper-Security Feature Grid */}
            <Container className="py-5 mb-5">
                <Row className="g-5">
                    <Col lg={4}>
                        <div className="benefit-card">
                            <div className="benefit-icon-wrapper">
                                <Shield className="text-primary" size={32} />
                            </div>
                            <h4 className="fw-900 text-white mb-3">Elite Access</h4>
                            <p className="text-secondary fw-bold opacity-75 ls-tight">Exclusive availability nodes reserved for verified platform members.</p>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="benefit-card">
                            <div className="benefit-icon-wrapper">
                                <Cpu className="text-primary" size={32} />
                            </div>
                            <h4 className="fw-900 text-white mb-3">Algorithmic Curation</h4>
                            <p className="text-secondary fw-bold opacity-75 ls-tight">AI-driven selection matching your stay profile with high-vibe assets.</p>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="benefit-card">
                            <div className="benefit-icon-wrapper">
                                <HardDrive className="text-primary" size={32} />
                            </div>
                            <h4 className="fw-900 text-white mb-3">Zero-Trust Privacy</h4>
                            <p className="text-secondary fw-bold opacity-75 ls-tight">End-to-end encrypted reservation data securing your travel footprint.</p>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Final CTA Section */}
            <Container className="py-5 mt-5">
                <div className="glass-card p-5 p-md-5 text-center border-white border-opacity-10 shadow-22xl bg-primary bg-opacity-5 relative overflow-hidden rounded-5">
                    <div className="hero-glow-1 opacity-20"></div>
                    <div className="position-relative" style={{ zIndex: 5 }}>
                        <h2 className="display-5 fw-900 text-white mb-3 ls-tight">Unlocking Global Sanctuaries</h2>
                        <p className="text-secondary fw-bold fs-5 mb-5 opacity-75 ls-1">Join the inner circle and synchronize your journey with the world's most elite stays.</p>
                        <div className="d-flex flex-column flex-md-row justify-content-center gap-4">
                            <Button as={Link} to="/register" className="btn-primary px-5 py-4 rounded-pill fw-900 ls-2 fs-5 shadow-22xl">BEGIN YOUR ODYSSEY</Button>
                            <Button as={Link} to="/" className="btn-outline-secondary px-5 py-4 rounded-pill fw-900 ls-2 fs-5 border-white border-opacity-10 text-white">BROWSE SECTORS</Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Home;
