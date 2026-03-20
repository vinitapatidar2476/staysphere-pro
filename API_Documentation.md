# API Documentation for Hotel Booking Platform

## Base URL
\`http://localhost:5000/api\`

---

### Authentication \`/api/auth\`
| Method | Endpoint | Description | Auth Required | Body Params |
|--------|----------|-------------|---------------|-------------|
| POST | \`/register\` | Register a new user | No | \`name\`, \`email\`, \`password\`, \`role\` |
| POST | \`/login\` | Login and receive JWT | No | \`email\`, \`password\` |
| GET  | \`/me\` | Get current user info | Yes | - |

---

### User/Admin Routes \`/api/users\`
| Method | Endpoint | Description | Auth Required | Body Params |
|--------|----------|-------------|---------------|-------------|
| GET | \`/\` | Get all users | Admin | - |
| PUT | \`/:id/role\` | Update user role | Admin | \`role\` |

---

### Hotels \`/api/hotels\`
| Method | Endpoint | Description | Auth Required | Body Params |
|--------|----------|-------------|---------------|-------------|
| GET | \`/\` | Get all approved hotels | No | (Query parameters for search/filters) |
| GET | \`/all\` | Get all hotels | Admin | - |
| GET | \`/manager\` | Get manager's hotels | Manager | - |
| GET | \`/:id\` | Get single hotel details | No | - |
| POST | \`/\` | Add a new hotel | Manager | \`name\`, \`city\`, \`address\`, \`description\`, \`amenities\` |
| PUT | \`/:id\` | Edit hotel details | Manager | (Updated hotel fields) |
| PATCH| \`/:id/approve\`| Approve/Reject a hotel | Admin | \`isApproved\` |

---

### Rooms \`/api/rooms\`
| Method | Endpoint | Description | Auth Required | Body Params |
|--------|----------|-------------|---------------|-------------|
| GET | \`/hotel/:hotelId\` | Get all rooms in a hotel | No | - |
| POST | \`/\` | Create new room type | Manager | \`hotelId\`, \`type\`, \`price\`, \`capacity\`, \`totalRooms\` |
| PUT | \`/:id\` | Edit room details | Manager | (Updated room fields) |

---

### Bookings \`/api/bookings\`
| Method | Endpoint | Description | Auth Required | Body Params |
|--------|----------|-------------|---------------|-------------|
| GET | \`/customer\` | Get all bookings of customer| Customer | - |
| GET | \`/hotel/:hotelId\` | Get all bookings of hotel | Manager | - |
| GET | \`/all\` | Get platform-wide bookings | Admin | - |
| POST | \`/create-order\` | Initiate Razorpay booking | Customer | \`hotelId\`, \`roomTypeId\`, \`checkIn\`, \`checkOut\`, \`amount\` |
| POST | \`/verify\` | Verify payment & create | Customer | \`razorpayOrderId\`, \`razorpayPaymentId\`, \`razorpaySignature\` |
| POST | \`/:id/cancel\` | Cancel booking & refund mode| Customer / Manager | - |

---

### Coupons \`/api/coupons\`
| Method | Endpoint | Description | Auth Required | Body Params |
|--------|----------|-------------|---------------|-------------|
| POST | \`/validate\` | Validate a coupon code | Customer | \`code\` |
| POST | \`/\` | Create a new coupon | Admin | \`code\`, \`discountPercent\`, \`validUntil\` |
| GET | \`/\` | Get all valid coupons | Admin / Customer | - |

---

### Reviews \`/api/reviews\`
| Method | Endpoint | Description | Auth Required | Body Params |
|--------|----------|-------------|---------------|-------------|
| GET | \`/hotel/:hotelId\` | Get all reviews for a hotel | No | - |
| POST | \`/\` | Add a comment & rating | Customer | \`hotelId\`, \`rating\`, \`comment\` |
