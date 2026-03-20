# Database ER Diagram for Hotel Booking API

## Users Collection
- **_id**: ObjectId (Primary Key)
- **name**: String (Full Name)
- **email**: String (Unique)
- **password**: String (Hashed)
- **role**: Enum ('admin', 'manager', 'customer')
- **createdAt**: Date (Timestamp)

## Hotels Collection
- **_id**: ObjectId (Primary Key)
- **managerId**: ObjectId (Foreign Key to Users Collection, Role=manager)
- **name**: String (Hotel Name)
- **city**: String (Location City)
- **address**: String (Full Address)
- **location**: Object ( { lat: Number, lng: Number } for Google Maps API integration)
- **description**: String (Details)
- **images**: Array of Strings (Image URLs)
- **amenities**: Array of Strings (e.g., Wifi, AC, Pool, etc.)
- **isApproved**: Boolean (Admin Approval Status, default false)

## Rooms Collection
- **_id**: ObjectId (Primary Key)
- **hotelId**: ObjectId (Foreign Key to Hotels Collection)
- **type**: Enum ('Single', 'Double', 'Suite')
- **price**: Number (Price Per Night)
- **capacity**: Number (Max Guests)
- **totalRooms**: Number (Total Number of Rooms of this type)

## Bookings Collection
- **_id**: ObjectId (Primary Key)
- **userId**: ObjectId (Foreign Key to Users Collection, Customer)
- **hotelId**: ObjectId (Foreign Key to Hotels Collection)
- **roomTypeId**: ObjectId (Foreign Key to Rooms Collection)
- **checkInDate**: Date
- **checkOutDate**: Date
- **guests**: Number
- **totalAmount**: Number (Total price)
- **paymentStatus**: Enum ('pending', 'paid', 'failed', 'refunded')
- **bookingStatus**: Enum ('confirmed', 'cancelled')
- **razorpayOrderId**: String (Payment ID via Razorpay)
- **razorpayPaymentId**: String (Razorpay reference token)

## Reviews Collection
- **_id**: ObjectId (Primary Key)
- **userId**: ObjectId (Foreign Key to Users Collection)
- **hotelId**: ObjectId (Foreign Key to Hotels Collection)
- **rating**: Number (1 to 5)
- **comment**: String (Customer feedback)

## Coupons Collection
- **_id**: ObjectId (Primary Key)
- **code**: String (Unique, e.g., 'SAVE10')
- **discountPercent**: Number
- **validUntil**: Date
