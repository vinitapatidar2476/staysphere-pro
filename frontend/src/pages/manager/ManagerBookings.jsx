import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Button } from 'react-bootstrap';
import { Calendar, User, Hotel as HotelIcon, CreditCard, Activity, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ManagerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/manager');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader-container"><span className="loader"></span></div>;

    return (
        <div className="manager-bookings-page pb-5 animate-fade-in">
            {/* Header */}
            <div className="bg-white bg-opacity-5 border-bottom border-white border-opacity-5 py-5 mb-5">
                <Container>
                    <Link to="/manager/dashboard" className="text-primary d-flex align-items-center gap-2 mb-3 text-decoration-none fw-bold small ls-1">
                        <ArrowLeft size={16} /> RETURN TO HUB
                    </Link>
                    <h2 className="display-6 fw-900 gradient-text mb-0">Reservation Ledger</h2>
                    <p className="text-secondary opacity-75 mt-2 fw-bold d-flex align-items-center gap-2">
                        <Activity size={14} className="text-primary" /> Auditing active portfolio bookings and guest flows.
                    </p>
                </Container>
            </div>

            <Container>
                <div className="glass-card overflow-hidden shadow-2xl border border-white border-opacity-5">
                    <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-white border-opacity-5 bg-white bg-opacity-5">
                        <h5 className="fw-900 mb-0 text-white ls-tight d-flex align-items-center gap-2">
                             <CreditCard size={20} className="text-primary" /> Active Reservations
                        </h5>
                        <Badge bg="white" className="bg-opacity-10 text-secondary ls-1 px-3 py-2 small fw-bold uppercase">LOG ENTRIES: {bookings.length}</Badge>
                    </div>
                    <div className="table-responsive">
                        <Table hover variant="dark" className="m-0 align-middle" style={{ background: 'transparent' }}>
                            <thead className="bg-white bg-opacity-5">
                                <tr>
                                    <th className="py-4 ps-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Guest Identity</th>
                                    <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Asset Entity</th>
                                    <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-center">Payment Status</th>
                                    <th className="py-4 pe-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-end">Market Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id} className="border-bottom border-white border-opacity-5 transition-all">
                                        <td className="py-4 ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="p-2 rounded-circle bg-white bg-opacity-10 text-secondary border border-white border-opacity-10">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="fw-900 text-white fs-6">{b.userId?.name || 'GUEST_NODE'}</div>
                                                    <div className="text-secondary x-small opacity-50 fw-bold ls-1 font-monospace">{b.userId?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div>
                                                <div className="fw-bold text-white small d-flex align-items-center gap-2">
                                                    <HotelIcon size={14} className="text-primary opacity-50" /> {b.hotelId?.name}
                                                </div>
                                                <div className="text-secondary x-small opacity-50 fw-bold mt-1 ls-1 font-monospace lowercase">{b.roomTypeId?.type}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <Badge bg={b.paymentStatus === 'paid' ? 'success' : 'warning'} className="bg-opacity-25 text-white px-4 py-2 rounded-pill small border border-white border-opacity-5 fw-bold ls-1 font-monospace">
                                                {b.paymentStatus.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="py-4 pe-4 text-end">
                                            <div className="text-white fw-900 fs-5">₹ {b.totalAmount.toLocaleString()}</div>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5">
                                            <div className="opacity-20 mb-3"><Activity size={48} /></div>
                                            <p className="text-secondary fw-bold small ls-1">NO ACTIVE JOURNEYS DISCOVERED.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ManagerBookings;
