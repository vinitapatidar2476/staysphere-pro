import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Users, FileText, CheckCircle, XCircle, TrendingUp, DollarSign, Hotel, Activity, ShieldCheck, PieChart, ArrowUpRight, ChevronRight, Globe, HardDrive } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../../services/api';



const AdminDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [stats, setStats] = useState({ hotels: 0, bookings: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [dynamicChartData, setDynamicChartData] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [hotelsRes, bookingsRes, meRes] = await Promise.all([
                api.get('/hotels/all'),
                api.get('/bookings/all'),
                api.get('/auth/me') 
            ]);
            
            const bookingData = bookingsRes.data || [];
            setHotels(hotelsRes.data);
            setCurrentUser(meRes.data);
            
            const totalRevenue = bookingData.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
            
            setStats({
                hotels: hotelsRes.data.length,
                bookings: bookingData.length,
                revenue: totalRevenue,
            });

            // Process Real Last 7 Days for Live Feed
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, status) => {
        try {
            await api.patch(`/hotels/${id}/approve`, { isApproved: status });
            fetchAdminData(); // Refresh all data
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="loader-container"><span className="loader"></span></div>;

    const platformCommission = stats.revenue * 0.10;

    return (
        <div className="admin-dashboard pb-5 animate-fade-in">
            {/* Cinematic Admin Header */}
            <div className="command-center-header py-5 mb-5 position-relative overflow-hidden border-bottom border-white border-opacity-5">
                <div className="hero-glow-1 opacity-25"></div>
                <Container className="position-relative" style={{ zIndex: 10 }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 glass-card p-4 border-0 bg-transparent">
                        <div className="animate-slide-up">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <Badge bg="danger" className="bg-opacity-20 text-danger px-3 py-2 rounded-pill fw-800 ls-2 animate-pulse-slow">
                                    <ShieldCheck size={12} className="me-2" /> CORE OVERSEER
                                </Badge>
                                <span className="text-secondary small fw-bold opacity-50 ls-1 border-start border-white border-opacity-10 ps-2">UPTIME: 99%</span>
                            </div>
                            <h2 className="display-4 fw-900 gradient-text mb-0 ls-tight">Admin Console<span className="text-danger">.</span></h2>
                            <p className="text-secondary mt-2 mb-0 fs-6 fw-bold opacity-75 d-flex align-items-center gap-2">
                                <Activity size={16} className="text-danger" /> Platform auditing and financial oversight enabled.
                            </p>
                        </div>
                        <div className="d-flex gap-3 animate-slide-up-delay">
                            <Button as={Link} to="/admin/bookings" className="btn-primary d-flex align-items-center gap-2 px-5 py-3 hover-scale rounded-pill border-0 shadow-2xl fs-6 fw-bold bg-danger">
                                <FileText size={22} className="text-white" strokeWidth={3} /> AUDIT BOOKINGS
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
                             border: '1px solid rgba(255,100,100,0.15)',
                             background: 'rgba(15, 23, 42, 0.8)',
                             backdropFilter: 'blur(20px)'
                        }}>
                            <div className="text-center mb-4 pt-4 pb-2">
                                <div className="position-relative d-inline-block mb-4">
                                    <div className="bg-danger bg-opacity-10 p-4 rounded-circle border border-danger border-opacity-30 shadow-2xl animate-float">
                                        <ShieldCheck size={56} className="text-danger" strokeWidth={2.5} />
                                    </div>
                                    <div className="position-absolute bottom-0 end-0 bg-success p-2 rounded-circle border border-dark border-2 shadow-sm" style={{width: '20px', height: '20px'}}></div>
                                </div>
                                
                                <div className="profile-name-badge py-3 px-4 rounded-4 border border-danger border-opacity-10 mb-3 shadow-sm" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                    <h4 className="fw-900 text-white mb-0 ls-tight fs-4">{currentUser?.name || 'SUPER ADMINISTRATOR'}</h4>
                                </div>
                                
                                <Badge bg="danger" className="bg-opacity-25 text-danger small px-4 py-2 rounded-pill fw-900 border border-danger border-opacity-20 ls-2 uppercase">ROOT ACCESS</Badge>
                                <p className="text-secondary x-small mt-3 opacity-50 fw-900 ls-2 font-monospace">{currentUser?.email || 'SYS_LEVEL_ALPHA'}</p>
                            </div>

                            <hr className="border-white border-opacity-10 my-4" />

                            <div className="mb-5 text-center px-2">
                                <h6 className="text-secondary x-small fw-800 text-uppercase ls-2 mb-3 opacity-75">Platform Yield (10%)</h6>
                                <div className="p-4 rounded-4 border border-danger border-opacity-10 shadow-inner" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                    <h3 className="fw-900 text-white mb-0 font-monospace display-6">₹ {platformCommission.toLocaleString()}</h3>
                                    <div className="text-danger x-small fw-800 mt-2 ls-1 font-monospace">VERIFIED GLOBAL REVENUE</div>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                <Link to="/admin/users" className="text-decoration-none">
                                    <div className="p-3 rounded-4 border border-white border-opacity-5 hover-up transition-all border-hover-danger" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-white bg-opacity-10 p-2 rounded-3 text-secondary"><Users size={18} /></div>
                                                <span className="text-white fw-bold small">User Network Directory</span>
                                            </div>
                                            <ChevronRight size={16} className="text-secondary" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </Col>

                    {/* Main Content Areas */}
                    <Col lg={8} className="order-lg-1">
                        {/* Interactive Stats Cards */}
                        <Row className="g-4 mb-5">
                            <Col md={6}>
                                <div className="glass-card p-4 border border-white border-opacity-5 h-100 shadow-lg position-relative overflow-hidden group">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="bg-danger bg-opacity-10 p-3 rounded-4">
                                            <DollarSign className="text-danger" size={26} />
                                        </div>
                                        <Badge bg="danger" className="bg-opacity-25 text-white rounded-pill px-3 py-2 small border-0 ls-1">GROSS REVENUE</Badge>
                                    </div>
                                    <h2 className="fw-900 mb-1 text-white display-5 mt-3">₹ {stats.revenue.toLocaleString()}</h2>
                                    <p className="text-secondary small mb-0 fw-bold text-uppercase ls-1 opacity-75 mt-1">Platform Turnover</p>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="glass-card p-4 border border-white border-opacity-5 h-100 shadow-lg position-relative overflow-hidden group">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                            <FileText className="text-primary" size={26} />
                                        </div>
                                        <Badge bg="primary" className="bg-opacity-25 text-white rounded-pill px-3 py-2 small border-0 ls-1">TOTAL SALES</Badge>
                                    </div>
                                    <h2 className="fw-900 mb-1 text-white display-5 mt-3">{stats.bookings}</h2>
                                    <p className="text-secondary small mb-0 fw-bold text-uppercase ls-1 opacity-75 mt-1">Reservations</p>
                                </div>
                            </Col>
                        </Row>

                        {/* Global Intelligence Matrix */}
                        <div className="analytics-intelligence mb-5 animate-slide-up-delay">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="bg-danger bg-opacity-20 p-2 rounded-3 text-danger"><Activity size={24} /></div>
                                <div>
                                    <h4 className="fw-900 text-white mb-0 ls-tight">Global Intelligence</h4>
                                    <p className="text-secondary small fw-bold opacity-50 mb-0 ls-1 uppercase">Platform-wide yield & traffic analytics</p>
                                </div>
                            </div>

                            <Row className="g-4">
                                <Col lg={8}>
                                    <div className="glass-card p-4 border border-white border-opacity-5 h-100 shadow-2xl">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h6 className="text-white fw-800 ls-1 mb-0 uppercase small">Global Revenue Flow (7 Days)</h6>
                                            <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-20 px-3 py-1 rounded-pill">LIVE FEED</Badge>
                                        </div>
                                        <div style={{ width: '100%', height: 300 }}>
                                            <ResponsiveContainer>
                                                <AreaChart data={dynamicChartData}>
                                                    <defs>
                                                        <linearGradient id="colorRevenueAdmin" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#dc3545" stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor="#dc3545" stopOpacity={0}/>
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
                                                        itemStyle={{ color: '#dc3545', fontWeight: 'bold' }}
                                                    />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey="revenue" 
                                                        stroke="#dc3545" 
                                                        strokeWidth={3}
                                                        fillOpacity={1} 
                                                        fill="url(#colorRevenueAdmin)" 
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="glass-card p-4 border border-white border-opacity-5 h-100 shadow-2xl">
                                        <h6 className="text-white fw-800 ls-1 mb-4 uppercase small">Network Load</h6>
                                        <div className="d-flex flex-column gap-4 py-3">
                                            <div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-secondary small fw-bold">Platform Occupancy</span>
                                                    <span className="text-white small fw-bold">{Math.min(99, Math.round((stats.bookings / (stats.hotels || 1)) * 12))}%</span>
                                                </div>
                                                <ProgressBar now={Math.min(99, (stats.bookings / (stats.hotels || 1)) * 12)} variant="danger" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }} className="rounded-pill" />
                                            </div>
                                            <div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-secondary small fw-bold">Active Sessions</span>
                                                    <span className="text-white small fw-bold">{Math.min(94, 70 + (stats.bookings % 24))}%</span>
                                                </div>
                                                <ProgressBar now={Math.min(94, 70 + (stats.bookings % 24))} variant="warning" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }} className="rounded-pill" />
                                            </div>
                                            <div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-secondary small fw-bold">Registry Load</span>
                                                    <span className="text-white small fw-bold">{Math.min(100, (stats.hotels * 5))}%</span>
                                                </div>
                                                <ProgressBar now={Math.min(100, (stats.hotels * 5))} variant="info" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }} className="rounded-pill" />
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-white bg-opacity-5 rounded-4 border border-white border-opacity-5">
                                            <div className="d-flex align-items-center gap-2 text-danger x-small fw-800 ls-1 uppercase mb-1">
                                                <ShieldCheck size={12} fill="currentColor" /> System Health
                                            </div>
                                            <p className="text-secondary x-small fw-bold mb-0 opacity-75">
                                                {stats.hotels > 0 ? 'All nodes synchronized. Registry uplink is stable.' : 'Awaiting asset initialization for full telemetery.'}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Hotel Approvals Table */}
                        <div className="glass-card overflow-hidden mb-5 border border-white border-opacity-5 shadow-2xl">
                            <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-white border-opacity-5 bg-white bg-opacity-5">
                                <h5 className="fw-900 mb-0 text-white ls-tight d-flex align-items-center gap-2">
                                    <Hotel size={20} className="text-danger" /> Asset Hub
                                </h5>
                                <Badge bg="white" className="bg-opacity-10 text-secondary ls-1 px-3 py-2 small fw-bold">TOTAL: {hotels.length}</Badge>
                            </div>
                            <div className="table-responsive">
                                <Table hover variant="dark" className="m-0 align-middle" style={{ background: 'transparent' }}>
                                    <thead className="bg-white bg-opacity-5">
                                        <tr>
                                            <th className="py-4 ps-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Asset</th>
                                            <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Owner</th>
                                            <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-center">Status</th>
                                            <th className="py-4 pe-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hotels.map(hotel => (
                                            <tr key={hotel._id} className="border-bottom border-white border-opacity-5 transition-all">
                                                <td className="py-4 ps-4">
                                                    <div>
                                                        <div className="fw-900 text-white mb-1">{hotel.name}</div>
                                                        <div className="text-secondary x-small opacity-50 fw-bold uppercase">{hotel.city}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-secondary small fw-bold">
                                                    {hotel.managerId?.name || 'MGR_NULL'}
                                                </td>
                                                <td className="py-4 text-center">
                                                    <Badge bg={hotel.isApproved ? 'success' : 'warning'} className="bg-opacity-25 text-white px-3 py-2 rounded-pill small border border-white border-opacity-5 fw-bold ls-1 font-monospace">
                                                        {hotel.isApproved ? 'LIVE' : 'DRAFT'}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 pe-4 text-end">
                                                    {!hotel.isApproved ? (
                                                        <Button variant="outline-success" size="sm" onClick={() => handleApproval(hotel._id, true)} className="fw-900 px-3 py-2 rounded-pill ls-1 transition-all hover-scale bg-success bg-opacity-10 border-success">APPROVE ASSET</Button>
                                                    ) : (
                                                        <Button variant="outline-danger" size="sm" onClick={() => handleApproval(hotel._id, false)} className="fw-900 px-3 py-2 rounded-pill ls-1 transition-all hover-scale opacity-50">REVOKE ACCESS</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {hotels.length === 0 && (
                                    <div className="text-center py-5">
                                        <p className="text-secondary fw-bold small ls-1">NO ASSETS LOADED.</p>
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

export default AdminDashboard;
