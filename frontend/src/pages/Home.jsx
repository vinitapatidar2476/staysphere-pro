import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Badge, Offcanvas, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Globe, Award, Filter, DollarSign, X, Zap, ArrowRight, Shield, Cpu, HardDrive, Layers, Clock, TrendingUp } from 'lucide-react';
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
        <div className="home-page animate-fade-in pb-5">
            {/* Immersive Hero Section */}
            <section className="position-relative overflow-hidden py-5 min-vh-100 d-flex align-items-center">
                <div className="hero-glow-1 position-absolute top-0 start-0 w-100 h-100 opacity-20 pointer-events-none"></div>
                <div className="hero-glow-2 position-absolute bottom-0 end-0 w-100 h-100 opacity-20 pointer-events-none"></div>
                
                <Container className="position-relative text-center pb-5" style={{ zIndex: 10 }}>
                    <div className="animate-slide-up">
                        <Badge bg="primary" className="bg-opacity-10 text-primary px-4 py-2 rounded-pill fw-900 ls-2 mb-4 border border-primary border-opacity-20 animate-float">
                            <Award size={14} className="me-2" /> SUPREME LUXURY NETWORK
                        </Badge>
                        <h1 className="display-1 fw-800 mb-4 ls-tight text-white">
                            Global Stay<span className="primary-gradient-text px-3">Sync.</span> <br /> 
                            <span className="text-secondary opacity-60">Elite. Secure. Bespoke.</span>
                        </h1>
                        <p className="text-secondary fw-600 fs-5 mb-5 opacity-80 max-w-2xl mx-auto lh-lg ls-05">
                            Synchronize your journey with the world's most high-vibe asset nodes.<br/> 
                            Architected for the next-generation global explorer.
                        </p>
                        
                        <div className="d-flex flex-wrap justify-content-center gap-4 mt-5">
                            <div className="stat-pill glass-card p-3 px-4 rounded-4 border-white border-opacity-5 d-flex align-items-center gap-3">
                                <TrendingUp className="text-primary" size={24} />
                                <div className="text-start">
                                    <div className="text-white fw-900 fs-4 lh-1 mb-1">12,500+</div>
                                    <div className="text-secondary x-small fw-800 ls-2 uppercase">Verified Nodes</div>
                                </div>
                            </div>
                            <div className="stat-pill glass-card p-3 px-4 rounded-4 border-white border-opacity-5 d-flex align-items-center gap-3">
                                <Layers className="text-primary" size={24} />
                                <div className="text-start">
                                    <div className="text-white fw-900 fs-4 lh-1 mb-1">98.4%</div>
                                    <div className="text-secondary x-small fw-800 ls-2 uppercase">Safety Sync</div>
                                </div>
                            </div>
                            <div className="stat-pill glass-card p-3 px-4 rounded-4 border-white border-opacity-5 d-flex align-items-center gap-3">
                                <Clock className="text-primary" size={24} />
                                <div className="text-start">
                                    <div className="text-white fw-900 fs-4 lh-1 mb-1">Instant</div>
                                    <div className="text-secondary x-small fw-800 ls-2 uppercase">Resync Protocol</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Tactical Search Engine */}
            <Container className="position-relative py-5" style={{ zIndex: 20 }}>
                <Card className="glass-panel p-4 p-md-5 border-white border-opacity-10 shadow-22xl rounded-5 overflow-hidden">
                    <Form onSubmit={handleSearch}>
                        <Row className="g-4">
                            <Col lg={4}>
                                <div className="search-input-group glass-card bg-white bg-opacity-5 rounded-4 p-2 transition-all">
                                    <label className="text-secondary x-small fw-900 ls-2 uppercase ms-3 mb-2 mt-1">Search Nodes</label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-transparent border-0 ps-3 text-primary"><Search size={20} /></InputGroup.Text>
                                        <Form.Control 
                                            placeholder="Asset name or sector..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-transparent border-0 text-white shadow-none fs-5 fw-600 ls-tight"
                                        />
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <div className="search-input-group glass-card bg-white bg-opacity-5 rounded-4 p-2 transition-all">
                                    <label className="text-secondary x-small fw-900 ls-2 uppercase ms-3 mb-2 mt-1">Location Sector</label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-transparent border-0 ps-3 text-secondary"><MapPin size={20} /></InputGroup.Text>
                                        <Form.Control 
                                            placeholder="City identity..." 
                                            value={cityFilter}
                                            onChange={(e) => setCityFilter(e.target.value)}
                                            className="bg-transparent border-0 text-white shadow-none fs-5 fw-600 ls-tight"
                                        />
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col lg={2}>
                                <Button 
                                    variant="outline-premium" 
                                    className="w-100 h-100 rounded-4 d-flex align-items-center justify-content-center gap-2 transform transition-all group py-4 py-lg-0"
                                    onClick={() => setShowFilters(true)}
                                >
                                    <Filter size={20} className="group-hover:rotate-12 transition-transform" />
                                    <span className="fw-900 ls-2 uppercase small">Filters</span>
                                </Button>
                            </Col>
                            <Col lg={3}>
                                <Button type="submit" className="btn-premium w-100 h-100 rounded-4 py-4 py-lg-0 fs-5 ls-2 h-auto" style={{ minHeight: '84px' }}>
                                    <Zap size={22} fill="currentColor" /> SYNC ASSETS
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Container>

            {/* Asset Collection */}
            <Container className="section-padding pt-5 mt-5">
                <div className="d-flex flex-column align-items-center text-center mb-5 pb-4">
                    <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-1 rounded-pill fw-900 ls-2 mb-3 border border-primary border-opacity-10 text-uppercase">
                        Global Feed
                    </Badge>
                    <h2 className="display-4 fw-800 text-white ls-tight">Elite Availability<span className="text-primary">.</span></h2>
                    <div className="w-24 border-bottom border-primary border-4 rounded-pill mt-3 mb-4" style={{width: '60px'}}></div>
                </div>

                {loading ? (
                    <div className="text-center py-10 opacity-50"><Spinner animation="border" className="text-primary" /></div>
                ) : hotels.length === 0 ? (
                    <div className="text-center py-10 glass-panel rounded-5 p-10 mt-4 border-dashed border-white border-opacity-5">
                        <Globe size={100} strokeWidth={0.5} className="text-primary mb-4 animate-pulse-soft opacity-30" />
                        <h3 className="fw-900 text-white opacity-40">NO AVAILABLE NODES FOUND.</h3>
                        <p className="text-secondary small fw-900 ls-2 mt-2 uppercase opacity-40">ADJUST FILTERS TO RESYNC LOCAL FEED.</p>
                        <Button variant="outline-premium" onClick={clearFilters} className="mt-5 rounded-pill px-5">CLEAR ALL SYSTEM FILTERS</Button>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-5 px-lg-3">
                        {hotels.map(hotel => (
                            <Col key={hotel._id}>
                                <Card className="glass-card h-100 border-0 rounded-5 overflow-hidden hover-up">
                                    <div className="position-relative overflow-hidden" style={{ height: '300px' }}>
                                        <Card.Img 
                                            variant="top" 
                                            src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=800&q=80'} 
                                            className="w-100 h-100 object-fit-cover transition-all duration-700 hover:scale-110"
                                        />
                                        <div className="position-absolute top-0 end-0 p-3">
                                            <Badge className="bg-dark bg-opacity-80 backdrop-blur-md px-3 py-2 rounded-4 fw-900 ls-1 fs-6 border border-white border-opacity-10 text-primary">
                                                ₹{hotel.minPrice?.toLocaleString()} /UNIT
                                            </Badge>
                                        </div>
                                        <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.9), transparent)' }}>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <Badge bg="primary" className="fw-900 rounded-pill px-3 py-1 d-flex align-items-center gap-1 shadow-lg">
                                                    <Star size={12} fill="currentColor" /> {hotel.avgRating || '4.8'}
                                                </Badge>
                                                <span className="text-secondary x-small fw-800 ls-2 uppercase">SYNC STATUS: LIVE</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Card.Body className="p-4 p-xl-5 flex-grow-1 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 text-secondary x-small fw-900 ls-2 uppercase opacity-60 mb-3">
                                            <MapPin size={12} className="text-primary" /> {hotel.city} SECTOR
                                        </div>
                                        <Card.Title className="fw-800 fs-3 text-white ls-tight mb-4">{hotel.name}</Card.Title>
                                        <div className="d-flex flex-wrap gap-2 mb-5">
                                            {hotel.amenities?.slice(0, 3).map(a => (
                                                <Badge key={a} bg="white" className="bg-opacity-5 text-secondary border border-white border-opacity-5 p-2 px-3 fw-800 ls-1 x-small uppercase">{a}</Badge>
                                            ))}
                                        </div>
                                        <Button as={Link} to={`/hotel/${hotel._id}`} className="btn-premium w-100 mt-auto rounded-pill py-3 ls-wide">
                                            VIEW DOSSIER <ArrowRight size={18} />
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* Strategic Advantage */}
            <div className="bg-slate-900 bg-opacity-30 border-y border-white border-opacity-5 py-5 my-5">
                <Container className="py-5">
                    <Row className="g-5 align-items-center">
                        <Col lg={6}>
                            <div className="bg-primary rounded-5 p-2 shadow-22xl mb-4 d-inline-block">
                                <Shield className="text-white" size={32} />
                            </div>
                            <h2 className="display-4 fw-800 text-white mb-4">Elite Defense Architecture.</h2>
                            <p className="text-secondary fs-5 lh-lg mb-5 max-w-xl opacity-80">
                                Your journey footprint is architected within a zero-trust vault. Every reservation is encrypted, verified, and synchronized across our high-vibe stay nodes.
                            </p>
                            <Row className="g-4">
                                <Col sm={6}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary bg-opacity-20 d-flex align-items-center justify-content-center text-primary fw-900">✓</div>
                                        <span className="text-white fw-700 small ls-1">Quantum-Safe Auth</span>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary bg-opacity-20 d-flex align-items-center justify-content-center text-primary fw-900">✓</div>
                                        <span className="text-white fw-700 small ls-1">Verified Stay Nodes</span>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary bg-opacity-20 d-flex align-items-center justify-content-center text-primary fw-900">✓</div>
                                        <span className="text-white fw-700 small ls-1">Instant Resync</span>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary bg-opacity-20 d-flex align-items-center justify-content-center text-primary fw-900">✓</div>
                                        <span className="text-white fw-700 small ls-1">Global 24/7 Intel</span>
                                    </div>
                                </Col>
                            </Row>
                            <Button className="btn-premium px-5 py-4 rounded-pill mt-10 ls-wide fs-6 mt-5">UPGRADE TO ELITE TIER</Button>
                        </Col>
                        <Col lg={6}>
                            <div className="position-relative">
                                <div className="glass-panel p-2 rounded-5 rotate-3 overflow-hidden shadow-22xl border-white border-opacity-10 animate-pulse-soft">
                                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" alt="luxury stay" className="w-100 h-100 rounded-5 transition-all grayscale-50 hover:grayscale-0" />
                                </div>
                                <div className="position-absolute glass-panel p-4 p-xl-5 rounded-5 border-white border-opacity-10 shadow-22xl d-none d-lg-block animate-float shadow-primary-glow" style={{ bottom: '-60px', left: '-100px', zIndex: 10 }}>
                                    <Cpu className="text-primary mb-3" size={32} />
                                    <div className="text-white fw-900 display-6 lh-1">99.9<span className="text-primary small">%</span></div>
                                    <div className="text-secondary x-small fw-800 ls-2 uppercase mt-2 opacity-50">SYNC ACCURACY</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Final Conversion Node */}
            <Container className="section-padding">
                <div className="glass-card p-10 text-center relative overflow-hidden rounded-5 py-5 px-4" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(244,63,94,0.1) 100%)' }}>
                    <div className="position-relative" style={{ zIndex: 10 }}>
                        <h2 className="display-3 fw-900 text-white mb-4 ls-tight">Join the Inner Circle.</h2>
                        <p className="text-secondary fw-600 fs-5 mb-5 opacity-80 max-w-xl mx-auto uppercase ls-2">INITIALIZE YOUR ELITE TRAVEL PROTOCOL TODAY</p>
                        <div className="d-flex flex-column flex-md-row justify-content-center gap-4">
                            <Button as={Link} to="/register" className="btn-premium px-10 py-5 rounded-pill fs-5 ls-wide">BEGIN DEPLOYMENT</Button>
                            <Button as={Link} to="/login" variant="outline-premium" className="px-10 py-5 rounded-pill fs-5 ls-wide">RECOVER IDENTITY</Button>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Filter Drawer */}
            <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end" className="glass-panel border-0 text-white" style={{ width: '400px' }}>
                <Offcanvas.Header closeButton closeVariant="white" className="p-5 border-bottom border-white border-opacity-5">
                    <Offcanvas.Title className="font-outfit fw-800 fs-3 uppercase ls-1">FEED PARAMETERS</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-5">
                    <Form className="d-flex flex-column gap-5">
                        <Form.Group>
                            <label className="text-secondary small fw-900 ls-2 uppercase mb-4 d-block">Price Ceiling</label>
                            <Form.Select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="bg-white bg-opacity-5 border-white border-opacity-10 p-3 rounded-4 text-white shadow-none fs-6 ls-wide cursor-pointer">
                                <option value="" className="bg-slate-900">Total Spectrum</option>
                                <option value="5000" className="bg-slate-900">Below INR 5,000</option>
                                <option value="10000" className="bg-slate-900">Below INR 10,000</option>
                                <option value="25000" className="bg-slate-900">Below INR 25,000</option>
                                <option value="50000" className="bg-slate-900">Below INR 50,000</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <label className="text-secondary small fw-900 ls-2 uppercase mb-4 d-block">Min. Quality Score</label>
                            <div className="d-flex gap-2">
                                {[3, 4, 4.5].map(r => (
                                    <Button 
                                        key={r} 
                                        variant={ratingFilter == r ? 'primary' : 'outline-premium'} 
                                        className={`flex-fill rounded-4 py-3 fw-800 ${ratingFilter == r ? 'shadow-lg border-primary translate-y-[-4px]' : 'opacity-60'}`}
                                        onClick={() => setRatingFilter(r)}
                                    >
                                        {r}+ <Star size={14} fill={ratingFilter == r ? 'currentColor' : 'none'} className="ms-1" />
                                    </Button>
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <label className="text-secondary small fw-900 ls-2 uppercase mb-4 d-block">Required Amenities</label>
                            <div className="d-flex flex-wrap gap-2">
                                {amenityList.map(a => (
                                    <div 
                                        key={a} onClick={() => toggleAmenity(a)} 
                                        className={`amenity-badge px-3 py-2 rounded-4 border fs-x-small fw-800 ls-1 cursor-pointer transition-all ${selectedAmenities.includes(a) ? 'bg-primary border-primary text-white shadow-lg translate-y-[-2px]' : 'border-white border-opacity-10 text-secondary opacity-60'}`}
                                        style={{ fontSize: '0.7rem' }}
                                    >
                                        {a.toUpperCase()}
                                    </div>
                                ))}
                            </div>
                        </Form.Group>

                        <div className="mt-auto pt-5 d-flex gap-3 mt-5">
                            <Button variant="outline-premium" className="flex-fill rounded-pill py-3 fw-900 ls-1 small uppercase" onClick={clearFilters}>Reset</Button>
                            <Button className="btn-premium flex-fill rounded-pill py-3 fw-900 ls-1 small uppercase" onClick={() => { fetchHotels(); setShowFilters(false); }}>Apply Sync</Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <style>{`
                .hero-glow-1 { background: radial-gradient(circle at 0% 0%, var(--primary-glow) 0%, transparent 70%); }
                .hero-glow-2 { background: radial-gradient(circle at 100% 100%, rgba(244,63,94,0.15) 0%, transparent 70%); }
                .stat-pill { backdrop-filter: blur(12px); }
                .search-input-group:focus-within { border-color: var(--primary) !important; background: rgba(99,102,241,0.08) !important; }
                .max-w-2xl { max-content: 800px; }
                .fs-x-small { font-size: 0.65rem; }
            `}</style>
        </div>
    );
};

export default Home;
