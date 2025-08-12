# API Documentation for Iron Wolf

## Overview
Iron Wolf provides a comprehensive API for managing gym operations, including membership management, class reservations, payment processing, and more. This document outlines the available endpoints, their methods, and usage examples.

## Base URL
The base URL for all API requests is:
```
https://api.ironwolf.com/v1
```

## Authentication
All API requests require authentication. Use the following method to authenticate:

### Token-Based Authentication
- **Endpoint**: `/auth/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

## Endpoints

### 1. Membership Management

#### Create Membership
- **Endpoint**: `/memberships`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "memberId": "12345",
    "plan": "monthly",
    "startDate": "2023-01-01",
    "endDate": "2023-12-31"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Membership created successfully",
    "membershipId": "67890"
  }
  ```

#### Get Membership Details
- **Endpoint**: `/memberships/{membershipId}`
- **Method**: GET
- **Response**:
  ```json
  {
    "membershipId": "67890",
    "memberId": "12345",
    "plan": "monthly",
    "status": "active"
  }
  ```

### 2. Class Reservations

#### Reserve Class
- **Endpoint**: `/reservations`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "classId": "abc123",
    "memberId": "12345",
    "date": "2023-01-15"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Class reserved successfully",
    "reservationId": "xyz789"
  }
  ```

#### Get Reservations
- **Endpoint**: `/reservations/{memberId}`
- **Method**: GET
- **Response**:
  ```json
  [
    {
      "reservationId": "xyz789",
      "classId": "abc123",
      "date": "2023-01-15"
    }
  ]
  ```

### 3. Payment Processing

#### Process Payment
- **Endpoint**: `/payments`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "memberId": "12345",
    "amount": 50.00,
    "paymentMethod": "credit_card"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Payment processed successfully",
    "transactionId": "trans_001"
  }
  ```

### 4. Reporting

#### Get Attendance Report
- **Endpoint**: `/reports/attendance`
- **Method**: GET
- **Response**:
  ```json
  {
    "totalAttendance": 150,
    "date": "2023-01-01"
  }
  ```

## Error Handling
All error responses will include a status code and a message. For example:
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

## Conclusion
This API documentation provides a high-level overview of the available endpoints and their usage. For further details, please refer to the specific endpoint documentation or contact support.