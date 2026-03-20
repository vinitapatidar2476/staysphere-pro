import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Form, Spinner, Badge, Row, Col } from 'react-bootstrap';
import { Plus, Layout, ArrowLeft, DollarSign, Users as UsersIcon, CheckCircle, Zap } from 'lucide-react';
import api from '../../services/api';

const ManageRooms = ({ hotelId, onBack }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ type: 'Standard', price: '', capacity: '', totalRooms: '' });
    const [submitting, setSubmitting] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, [hotelId]);

    const fetchRooms = async () => {
        try {
            const res = await api.get(`/rooms/hotel/${hotelId}`);
            setRooms(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            type: room.type,
            price: room.price,
            capacity: room.capacity,
            totalRooms: room.totalRooms
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to decommission this room type?')) return;
        try {
            await api.delete(`/rooms/${id}`);
            fetchRooms();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingRoom) {
                await api.put(`/rooms/${editingRoom._id}`, formData);
            } else {
                await api.post('/rooms', { ...formData, hotelId });
            }
            setShowModal(false);
            setEditingRoom(null);
            setFormData({ type: 'Standard', price: '', capacity: '', totalRooms: '' });
            fetchRooms();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <div className="manage-rooms-section animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 p-4 glass-card border-0 bg-white bg-opacity-5">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="outline-light" size="sm" onClick={onBack} className="rounded-circle p-2 border-white border-opacity-10 opacity-75 hover-opacity-100">
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h4 className="fw-900 text-white mb-0 ls-tight">Inventory Control</h4>
                        <p className="text-secondary small fw-bold mb-0 opacity-50">DYNAMIC PRICING & AVAILABILITY OVERRIDE</p>
                    </div>
                </div>
                <Button className="btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-pill border-0 shadow-lg fw-bold ls-1" onClick={() => { setEditingRoom(null); setShowModal(true); }}>
                    <Plus size={18} strokeWidth={3} /> INITIALIZE ROOM TYPE
                </Button>
            </div>

            <div className="glass-card overflow-hidden shadow-2xl border border-white border-opacity-5">
                <div className="table-responsive">
                    <Table hover variant="dark" className="m-0 align-middle" style={{ background: 'transparent' }}>
                        <thead className="bg-white bg-opacity-5">
                            <tr>
                                <th className="py-4 ps-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Architecture Category</th>
                                <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-center">Unit Yield (Price)</th>
                                <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-center">Capacity Node</th>
                                <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-center">Live Availability</th>
                                <th className="py-4 pe-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-end">Strategy Adjustments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room._id} className="border-bottom border-white border-opacity-5 transition-all">
                                    <td className="py-4 ps-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><Layout size={20} /></div>
                                            <div className="fw-900 text-white fs-6">{room.type} Suite</div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <Badge bg="white" className="bg-opacity-10 text-white px-3 py-2 rounded-pill small border border-white border-opacity-5 fw-bold font-monospace ls-1">₹ {room.price.toLocaleString()}</Badge>
                                    </td>
                                    <td className="py-4 text-center">
                                        <div className="d-flex align-items-center justify-content-center gap-2 text-secondary small fw-bold">
                                            <UsersIcon size={14} className="text-primary opacity-50" /> {room.capacity} GUESTS
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <div className="fw-bold text-white small font-monospace d-flex align-items-center justify-content-center gap-2">
                                            <Badge bg="success" className="bg-opacity-10 text-success p-1 rounded-circle"><CheckCircle size={10}/></Badge>
                                            {room.totalRooms} UNITS
                                        </div>
                                    </td>
                                    <td className="py-4 pe-4 text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(room)} className="px-3 rounded-pill fw-bold border-white border-opacity-10">SET PRICING</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(room._id)} className="px-3 rounded-pill fw-bold border-white border-opacity-10 opacity-50 hover-opacity-100">DELETE</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {rooms.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="opacity-20 mb-3"><Layout size={48} /></div>
                                        <p className="text-secondary fw-bold small ls-1">NO ROOM STRUCTURES DEFINED FOR THIS ASSET.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showModal} onHide={() => { setShowModal(false); setEditingRoom(null); }} centered className="dark-modal glass-modal">
                <Modal.Header closeButton className="border-white border-opacity-10 bg-transparent text-white">
                    <Modal.Title className="fw-900 ls-tight">{editingRoom ? 'Adjust Pricing & Availability' : 'Configure New Unit'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-transparent p-4">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label className="text-secondary small fw-bold text-uppercase ms-1 mb-2 ls-1">Architecture Category</Form.Label>
                            <Form.Select name="type" value={formData.type} onChange={handleChange} className="form-control py-3 shadow-none border-white border-opacity-10 bg-white bg-opacity-5 text-white" disabled={editingRoom}>
                                <option value="Standard" style={{background: 'var(--bg-main)'}}>Standard Executive</option>
                                <option value="Deluxe" style={{background: 'var(--bg-main)'}}>Deluxe Suite</option>
                                <option value="Premium" style={{background: 'var(--bg-main)'}}>Premium Villa</option>
                                <option value="Presidential" style={{background: 'var(--bg-main)'}}>Presidential Penthouse</option>
                            </Form.Select>
                        </Form.Group>
                        <Row className="g-4 mb-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="text-secondary small fw-bold text-uppercase ms-1 mb-2 ls-1 font-monospace">Unit Strategy Price (₹)</Form.Label>
                                    <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required className="form-control py-3 shadow-none border-white border-opacity-10 bg-white bg-opacity-5 text-white" placeholder="0.00" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="text-secondary small fw-bold text-uppercase ms-1 mb-2 ls-1 font-monospace">Node Capacity</Form.Label>
                                    <Form.Control type="number" name="capacity" value={formData.capacity} onChange={handleChange} required className="form-control py-3 shadow-none border-white border-opacity-10 bg-white bg-opacity-5 text-white" placeholder="Max Guests" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-5">
                            <Form.Label className="text-secondary small fw-bold text-uppercase ms-1 mb-2 ls-1 font-monospace">Live Unit Inventory (Availability)</Form.Label>
                            <Form.Control type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} required className="form-control py-3 shadow-none border-white border-opacity-10 bg-white bg-opacity-5 text-white" placeholder="Quantity of Rooms" />
                            <Form.Text className="text-secondary opacity-50 x-small mt-2 d-block fw-bold ls-1">This sets the total number of rooms officially available in this sector.</Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 py-3 rounded-pill fw-bold ls-2 border-0 shadow-lg d-flex align-items-center justify-content-center gap-2 transition-all hover-scale" disabled={submitting}>
                            {submitting ? <Spinner size="sm" /> : <><Zap size={18} strokeWidth={3} /> {editingRoom ? 'UPDATE CONFIGURATION' : 'COMMISSION UNIT'}</>}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ManageRooms;
