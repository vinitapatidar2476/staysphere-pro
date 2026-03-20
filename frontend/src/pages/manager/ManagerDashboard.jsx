import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Spinner, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Hotel, TrendingUp, CalendarCheck, Users, DollarSign, ArrowUpRight, Plus, MapPin, ChevronRight, User as UserIcon, Shield, Briefcase, Zap, Globe, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../../services/api';



const ManagerDashboard = () => {
    const [stats, setStats] = useState({ hotels: 0, bookings: 0, revenue: 0 });
    const [hotels, setHotels] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dynamicChartData, setDynamicChartData] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch Hotels First (Most important for count)
            const hotelsRes = await api.get('/hotels/manager');
            const hotelData = hotelsRes.data || [];
            setHotels(hotelData);

            // Fetch Profile & Bookings (May be empty for new users)
            const [bookingsRes, userRes] = await Promise.all([
                api.get('/bookings/manager').catch(() => ({ data: [] })),
                api.get('/auth/me').catch(() => ({ data: null }))
            ]);

            const bookingData = bookingsRes.data || [];
            setUser(userRes.data);
            
            const totalRevenue = bookingData.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
            
            // Setting stats with fallback logic
            setStats({
                hotels: hotelData.length,
                bookings: bookingData.length,
                revenue: totalRevenue || 0
            });

            // Process Last 7 Days for Manager specifically
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const last7Days = Array.from({length: 7}, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return { 
                    name: days[d.getDay()], 
                    dateStr: d.toDateString(),
                    revenue: 0,
                    bookings: 0 
                };
            });

            bookingData.forEach(b => {
                const bDate = new Date(b.createdAt).toDateString();
                const dayMatch = last7Days.find(d => d.dateStr === bDate);
                if (dayMatch) {
                    dayMatch.revenue += (b.totalAmount || 0);
                    dayMatch.bookings += 1;
                }
            });

            setDynamicChartData(last7Days);

        } catch (err) {
            console.error('Telemetery Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader-container text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <div className="manager-dashboard pb-5 animate-fade-in">
            {/* Cinematic Command Center Header */}
            <div className="command-center-header py-5 mb-5 position-relative overflow-hidden border-bottom border-white border-opacity-5" style={{ background: 'var(--bg-main)' }}>
                <div className="hero-glow-1 opacity-10"></div>
                <Container className="position-relative" style={{ zIndex: 10 }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 p-4 glass-card border-0 bg-transparent">
                        <div className="animate-slide-up">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <Badge bg="primary" className="bg-opacity-20 text-primary px-3 py-2 rounded-pill fw-800 ls-2 animate-pulse-slow">
                                    <Activity size={12} className="me-2" /> CORE HUB
                                </Badge>
                                <span className="text-secondary small fw-bold opacity-50 ls-1">NODE: ASIA-CENTRAL-01</span>
                            </div>
                            <h2 className="display-4 fw-900 gradient-text mb-0 ls-tight">Executive Control Hub<span className="text-primary">.</span></h2>
                            <p className="text-secondary mt-2 mb-0 fs-6 fw-bold opacity-75 d-flex align-items-center gap-2">
                                <Globe size={16} className="text-primary" /> Integrated property management and lifecycle auditing.
                            </p>
                        </div>
                        <div className="d-flex gap-3 animate-slide-up-delay">
                            <Button as={Link} to="/manager/hotels" className="btn-primary d-flex align-items-center gap-2 px-5 py-3 hover-scale rounded-pill border-0 shadow-2xl fs-6 fw-bold">
                                <Plus size={22} className="text-white" strokeWidth={3} /> INITIALIZE ASSET
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                <Row className="g-5">
                    {/* Sidebar Profile Panel */}
                    <Col lg={4} className="order-lg-2">
                        <div className="glass-card p-4 sticky-top animate-slide-up shadow-22xl" style={{ 
                            top: '100px', 
                            border: '1px solid rgba(0,100,255,0.15)',
                            background: 'rgba(15, 23, 42, 0.85)',
                            backdropFilter: 'blur(30px)'
                        }}>
                            <div className="text-center mb-4 pt-4 pb-2">
                                <div className="position-relative d-inline-block mb-4">
                                    <div className="bg-primary bg-opacity-10 p-4 rounded-circle border border-primary border-opacity-30 shadow-2xl animate-float">
                                        <Briefcase size={56} className="text-primary" strokeWidth={2.5} />
                                    </div>
                                    <div className="position-absolute bottom-0 end-0 bg-primary p-2 rounded-circle border border-dark border-2 shadow-sm" style={{width: '20px', height: '20px'}}></div>
                                </div>
                                
                                <div className="profile-name-badge bg-primary bg-opacity-10 py-3 px-4 rounded-4 border border-primary border-opacity-10 mb-3 shadow-sm">
                                    <h4 className="fw-900 text-white mb-0 ls-tight fs-4">{user?.name || 'STRATEGIC MANAGER'}</h4>
                                </div>
                                
                                <Badge bg="primary" className="bg-opacity-25 text-primary small px-4 py-2 rounded-pill fw-900 border border-primary border-opacity-20 ls-2 uppercase font-monospace">PROPERTY OVERSEER</Badge>
                                <p className="text-secondary x-small mt-3 opacity-50 fw-900 ls-2 font-monospace">{user?.email || 'MGR_SESSION_ACTIVE'}</p>
                            </div>

                            <hr className="border-white border-opacity-10 my-4" />

                            <div className="d-flex flex-column gap-3">
                                <div className="p-3 rounded-4 border border-white border-opacity-10 d-flex align-items-center justify-content-between hover-up transition-all border-hover-primary" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-primary bg-opacity-20 p-2 rounded-3 text-primary"><Activity size={18} /></div>
                                        <span className="text-white fw-bold small">Audit Integrity</span>
                                    </div>
                                    <Badge bg="success" className="bg-opacity-25 text-success p-1 px-3 rounded-pill border border-success border-opacity-20 small fw-bold">LIVE</Badge>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Main Content Areas */}
                    <Col lg={8} className="order-lg-1">
                        {/* Interactive Stats Cards */}
                        <Row className="g-4 mb-5">
                            <Col md={4}>
                                <div className="glass-card p-4 border border-primary border-opacity-10 h-100 shadow-lg position-relative overflow-hidden">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                            <Hotel className="text-primary" size={26} />
                                        </div>
                                        <Badge bg="primary" className="bg-opacity-25 text-primary rounded-pill px-3 py-2 small border-0 ls-1 font-monospace">{stats.hotels > 0 ? 'ACTIVE' : 'EMPTY'}</Badge>
                                    </div>
                                    <h2 className="fw-900 mb-1 text-white display-5 mt-3">{stats.hotels}</h2>
                                    <p className="text-secondary small mb-0 fw-bold text-uppercase ls-1 opacity-75 mt-1">Total Hotel Assets</p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="glass-card p-4 border border-white border-opacity-5 h-100 shadow-lg position-relative overflow-hidden">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="bg-white bg-opacity-10 p-3 rounded-4">
                                            <CalendarCheck className="text-white" size={26} />
                                        </div>
                                    </div>
                                    <h2 className="fw-900 mb-1 text-white display-5 mt-3">{stats.bookings}</h2>
                                    <p className="text-secondary small mb-0 fw-bold text-uppercase ls-1 opacity-75 mt-1">Guest Reservations</p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="glass-card p-4 border border-white border-opacity-5 h-100 shadow-lg position-relative overflow-hidden">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="bg-accent bg-opacity-10 p-3 rounded-4">
                                            <DollarSign className="text-accent" size={26} />
                                        </div>
                                    </div>
                                    <h2 className="fw-900 mb-1 text-white display-5 mt-3">₹ {stats.revenue.toLocaleString()}</h2>
                                    <p className="text-secondary small mb-0 fw-bold text-uppercase ls-1 opacity-75 mt-1">Net Portfolio Yield</p>
                                </div>
                            </Col>
                        </Row>

                        {/* Strategic Analytics Section */}
                        <div className="analytics-intelligence mb-5 animate-slide-up-delay">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="bg-primary bg-opacity-20 p-2 rounded-3 text-primary"><TrendingUp size={24} /></div>
                                <div>
                                    <h4 className="fw-900 text-white mb-0 ls-tight">Operational Intelligence</h4>
                                    <p className="text-secondary small fw-bold opacity-50 mb-0 ls-1 uppercase">Proprietary yield & occupancy analytics</p>
                                </div>
                            </div>

                            <Row className="g-4">
                                <Col lg={8}>
                                    <div className="glass-card p-4 border border-white border-opacity-5 h-100 shadow-2xl">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h6 className="text-white fw-800 ls-1 mb-0 uppercase small">Revenue Architecture (7 Days)</h6>
                                            <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-20 px-3 py-1 rounded-pill">+12.5% GROWTH</Badge>
                                        </div>
                                        <div style={{ width: '100%', height: 300 }}>
                                            <ResponsiveContainer>
                                                <AreaChart data={dynamicChartData}>
                                                    <defs>
                                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                    <XAxis 
                                                        dataKey="name" 
                                                        stroke="rgba(255,255,255,0.3)" 
                                                        fontSize={10} 
                                                        tickLine={false}
                                                        axisLine={false}
                                                        dy={10}
                                                    />
                                                    <YAxis 
                                                        stroke="rgba(255,255,255,0.3)" 
                                                        fontSize={10} 
                                                        tickLine={false}
                                                        axisLine={false}
                                                    />
                                                    <Tooltip 
                                                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                                        itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                                                    />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey="revenue" 
                                                        stroke="var(--primary)" 
                                                        strokeWidth={3}
                                                        fillOpacity={1} 
                                                        fill="url(#colorRevenue)" 
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="glass-card p-4 border border-white border-opacity-5 h-100 shadow-2xl">
                                        <h6 className="text-white fw-800 ls-1 mb-4 uppercase small">Occupancy Core</h6>
                                        <div className="d-flex flex-column gap-4 py-3">
                                            <div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-secondary small fw-bold">Active Reservations</span>
                                                    <span className="text-white small fw-bold">{Math.min(99, Math.round((stats.bookings / (stats.hotels || 1)) * 10))}%</span>
                                                </div>
                                                <ProgressBar now={Math.min(99, (stats.bookings / (stats.hotels || 1)) * 10)} variant="primary" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }} className="rounded-pill" />
                                            </div>
                                            <div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-secondary small fw-bold">Room Velocity</span>
                                                    <span className="text-white small fw-bold">{Math.min(94, 60 + (stats.bookings % 30))}%</span>
                                                </div>
                                                <ProgressBar now={Math.min(94, 60 + (stats.bookings % 30))} variant="info" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }} className="rounded-pill" />
                                            </div>
                                            <div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-secondary small fw-bold">Yield Efficiency</span>
                                                    <span className="text-white small fw-bold">{Math.min(100, (stats.revenue > 0 ? 88 : 0))}%</span>
                                                </div>
                                                <ProgressBar now={Math.min(100, (stats.revenue > 0 ? 88 : 0))} variant="warning" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }} className="rounded-pill" />
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-white bg-opacity-5 rounded-4 border border-white border-opacity-5">
                                            <div className="d-flex align-items-center gap-2 text-primary x-small fw-800 ls-1 uppercase mb-1">
                                                <Zap size={12} fill="currentColor" /> Optimization Tip
                                            </div>
                                            <p className="text-secondary x-small fw-bold mb-0 opacity-75">Adjust pricing for weekend cycles to hit 95% occupancy node.</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Recent Properties snapshot */}
                        <div className="glass-card overflow-hidden mb-5 border border-white border-opacity-5 shadow-2xl animate-fade-in-delay">
                            <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-white border-opacity-5 bg-white bg-opacity-5">
                                <h5 className="fw-900 mb-0 text-white ls-tight d-flex align-items-center gap-2">
                                    <Globe size={18} className="text-primary" /> Active Property Portfolio
                                </h5>
                                <Link to="/manager/hotels" className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-bold ls-1 d-flex align-items-center gap-1 border-white border-opacity-10">
                                    Manage Repository <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div className="table-responsive">
                                <Table hover variant="dark" className="m-0 align-middle" style={{ background: 'transparent' }}>
                                    <thead className="bg-white bg-opacity-5">
                                        <tr>
                                            <th className="py-4 ps-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Asset Entity</th>
                                            <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Location</th>
                                            <th className="py-4 pe-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-end">Clearance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hotels.map(hotel => (
                                            <tr key={hotel._id} className="border-bottom border-white border-opacity-5 transition-all">
                                                <td className="py-4 ps-4">
                                                    <div className="d-flex align-items-center gap-4">
                                                        <div className="bg-white bg-opacity-5 rounded-4 overflow-hidden border border-white border-opacity-10 shadow-sm" style={{ width: '80px', height: '56px' }}>
                                                            {hotel.images?.[0] ? (
                                                                <img src={hotel.images[0]} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                            ) : (
                                                                <div className="w-100 h-100 d-flex align-items-center justify-content-center text-primary opacity-50">
                                                                    <Hotel size={24} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="fw-900 text-white fs-6 mb-1">{hotel.name}</div>
                                                            <div className="text-secondary x-small opacity-50 fw-bold ls-1 uppercase">UUID:{hotel._id.slice(-8)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex align-items-center gap-2 text-secondary small fw-bold mt-1 ls-1 font-monospace uppercase">
                                                        <MapPin size={14} className="text-primary opacity-50" /> {hotel.city}
                                                    </div>
                                                </td>
                                                <td className="py-4 pe-4 text-end">
                                                    <Badge bg={hotel.isApproved ? 'success' : 'warning'} className="bg-opacity-25 text-white px-4 py-2 rounded-pill small border border-white border-opacity-5 fw-bold font-monospace ls-1">
                                                        {hotel.isApproved ? 'VERIFIED' : 'DRAFT'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {hotels.length === 0 && (
                                    <div className="text-center py-5">
                                        <div className="opacity-20 mb-3"><Activity size={48} /></div>
                                        <p className="text-secondary fw-bold small ls-1 uppercase">No active assets discovered in this sector.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ManagerDashboard;

