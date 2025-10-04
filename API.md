# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-backend-url.onrender.com/api`

## Authentication
Currently, the API does not require authentication. In a production environment, you should implement proper authentication.

## Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Slots

#### Create a Slot
```
POST /slots
```
Creates a new recurring slot.

**Request Body:**
```json
{
  "day_of_week": 1,
  "start_time": "09:00",
  "end_time": "11:00",
  "created_for_date": "2024-01-01"
}
```

**Parameters:**
- `day_of_week` (number, required): Day of the week (0=Sunday, 1=Monday, ..., 6=Saturday)
- `start_time` (string, required): Start time in HH:MM format
- `end_time` (string, required): End time in HH:MM format
- `created_for_date` (string, required): Date in YYYY-MM-DD format

**Response:**
```json
{
  "id": 1,
  "day_of_week": 1,
  "start_time": "09:00",
  "end_time": "11:00",
  "created_for_date": "2024-01-01",
  "is_recurring": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Get Slots for a Week
```
GET /slots/week?startDate=YYYY-MM-DD
```
Retrieves all slots for a specific week.

**Query Parameters:**
- `startDate` (string, required): Start date of the week in YYYY-MM-DD format

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "day_of_week": 1,
    "slots": [
      {
        "id": 1,
        "start_time": "09:00",
        "end_time": "11:00",
        "is_exception": false
      }
    ]
  },
  {
    "date": "2024-01-02",
    "day_of_week": 2,
    "slots": []
  }
]
```

#### Get Slots for a Specific Date
```
GET /slots/date/:date
```
Retrieves all slots for a specific date.

**Path Parameters:**
- `date` (string, required): Date in YYYY-MM-DD format

**Response:**
```json
[
  {
    "id": 1,
    "start_time": "09:00",
    "end_time": "11:00",
    "is_exception": false
  }
]
```

#### Update a Slot
```
PUT /slots/:id
```
Updates a slot (affects all recurring instances).

**Path Parameters:**
- `id` (number, required): Slot ID

**Request Body:**
```json
{
  "start_time": "10:00",
  "end_time": "12:00"
}
```

**Parameters:**
- `start_time` (string, optional): New start time in HH:MM format
- `end_time` (string, optional): New end time in HH:MM format

**Response:**
```json
{
  "id": 1,
  "day_of_week": 1,
  "start_time": "10:00",
  "end_time": "12:00",
  "created_for_date": "2024-01-01",
  "is_recurring": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Delete a Slot
```
DELETE /slots/:id
```
Deletes a slot (affects all recurring instances).

**Path Parameters:**
- `id` (number, required): Slot ID

**Response:**
```
204 No Content
```

#### Update a Slot for a Specific Date
```
PUT /slots/:id/date
```
Updates a slot for a specific date (creates an exception).

**Path Parameters:**
- `id` (number, required): Slot ID

**Request Body:**
```json
{
  "date": "2024-01-01",
  "start_time": "10:00",
  "end_time": "12:00"
}
```

**Parameters:**
- `date` (string, required): Date in YYYY-MM-DD format
- `start_time` (string, optional): New start time in HH:MM format
- `end_time` (string, optional): New end time in HH:MM format

**Response:**
```json
{
  "id": 1,
  "slot_id": 1,
  "exception_date": "2024-01-01",
  "start_time": "10:00",
  "end_time": "12:00",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Delete a Slot for a Specific Date
```
DELETE /slots/:id/date
```
Deletes a slot for a specific date (creates an exception).

**Path Parameters:**
- `id` (number, required): Slot ID

**Request Body:**
```json
{
  "date": "2024-01-01"
}
```

**Parameters:**
- `date` (string, required): Date in YYYY-MM-DD format

**Response:**
```json
{
  "id": 1,
  "slot_id": 1,
  "exception_date": "2024-01-01",
  "start_time": null,
  "end_time": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Start time must be before end time"
}
```

### 404 Not Found
```json
{
  "error": "Slot not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Data Models

### Slot
```typescript
interface Slot {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_for_date: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}
```

### Slot Exception
```typescript
interface SlotException {
  id: number;
  slot_id: number;
  exception_date: string;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
  updated_at: string;
}
```

### Week Slots Response
```typescript
interface WeekSlotsResponse {
  date: string;
  day_of_week: number;
  slots: Array<{
    id: number;
    start_time: string;
    end_time: string;
    is_exception: boolean;
  }>;
}
```

## Usage Examples

### Creating a Monday 9 AM - 11 AM Slot
```bash
curl -X POST http://localhost:3001/api/slots \
  -H "Content-Type: application/json" \
  -d '{
    "day_of_week": 1,
    "start_time": "09:00",
    "end_time": "11:00",
    "created_for_date": "2024-01-01"
  }'
```

### Getting This Week's Slots
```bash
curl "http://localhost:3001/api/slots/week?startDate=2024-01-01"
```

### Updating a Slot for a Specific Date
```bash
curl -X PUT http://localhost:3001/api/slots/1/date \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-01",
    "start_time": "10:00",
    "end_time": "12:00"
  }'
```

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

The API is configured to accept requests from:
- Development: `http://localhost:3000`
- Production: Your frontend domain

## Security Considerations

1. **Input Validation**: All inputs are validated using Joi schemas
2. **SQL Injection**: Protected using Knex.js query builder
3. **CORS**: Configured to only allow requests from authorized origins
4. **Helmet**: Security headers are set using Helmet middleware

## Future Enhancements

1. **Authentication**: JWT-based authentication
2. **Rate Limiting**: Prevent API abuse
3. **Caching**: Redis caching for frequently accessed data
4. **Webhooks**: Real-time updates for slot changes
5. **Bulk Operations**: Create/update/delete multiple slots at once
