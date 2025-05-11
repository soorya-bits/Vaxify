# Vaxify API Documentation

Welcome to the Vaxify API documentation. This API is designed to manage vaccination drives, students, vaccines, users, and dashboard metrics for St. Mary’s High School.

## Base URL
The base URL for the API is: `http://localhost:8000`

---

## Authentication

### Login
**POST** `/auth/login`

- **Description**: Authenticate a user and return an access token.
- **Request Body**:
  - `username` (string): The username of the user.
  - `password` (string): The password of the user.
- **Response**: Access token for authenticated requests.

---

## Users

### Create a User
**POST** `/users/`

- **Description**: Create a new user.
- **Request Body**:
  - `username` (string): Username of the user.
  - `full_name` (string): Full name of the user.
  - `email` (string): Email address of the user.
  - `role` (string): Role of the user (e.g., `ADMIN`, `USER`).
  - `password` (string): Password for the user.
- **Response**: Details of the created user.

### Get All Users
**GET** `/users/`

- **Description**: Retrieve a list of all users.
- **Query Parameters**:
  - `skip` (int): Number of records to skip (default: 0).
  - `limit` (int): Maximum number of records to return (default: 10).
- **Response**: List of users.

### Get a Single User
**GET** `/users/{user_id}`

- **Description**: Retrieve details of a specific user by ID.
- **Response**: User details.

### Update a User
**PUT** `/users/{user_id}`

- **Description**: Update details of a specific user.
- **Request Body**:
  - Fields to update (e.g., `username`, `full_name`, `email`, `role`).
- **Response**: Updated user details.

### Delete a User
**DELETE** `/users/{user_id}`

- **Description**: Delete a user by ID.
- **Response**: Confirmation of deletion.

---

## Students

### Create a Student
**POST** `/students/`

- **Description**: Add a new student.
- **Request Body**: Student details (e.g., name, class, etc.).
- **Response**: Details of the created student.

### Get All Students
**GET** `/students/`

- **Description**: Retrieve a list of students with optional filters.
- **Query Parameters**:
  - `name` (string): Filter by student name.
  - `student_class` (string): Filter by class.
  - `vaccinated` (bool): Filter by vaccination status.
- **Response**: List of students.

### Update a Student
**PUT** `/students/{student_id}`

- **Description**: Update details of a specific student.
- **Request Body**: Updated student details.
- **Response**: Updated student details.

### Delete a Student
**DELETE** `/students/{student_id}`

- **Description**: Delete a student by ID.
- **Response**: Confirmation of deletion.

### Bulk Import Students
**POST** `/students/import`

- **Description**: Import students in bulk from a CSV file.
- **Request Body**: CSV file containing student details.
- **Response**: Confirmation of import.

### Mark Student as Vaccinated
**POST** `/students/{student_id}/vaccinate/{drive_id}`

- **Description**: Mark a student as vaccinated for a specific drive.
- **Response**: Confirmation of vaccination.

---

## Vaccines

### Create a Vaccine
**POST** `/vaccines/`

- **Description**: Add a new vaccine.
- **Request Body**:
  - `name` (string): Name of the vaccine.
  - `description` (string): Description of the vaccine.
  - `manufacturer` (string): Manufacturer of the vaccine.
- **Response**: Details of the created vaccine.

### Get All Vaccines
**GET** `/vaccines/`

- **Description**: Retrieve a list of all vaccines.
- **Response**: List of vaccines.

### Get a Single Vaccine
**GET** `/vaccines/{vaccine_id}`

- **Description**: Retrieve details of a specific vaccine by ID.
- **Response**: Vaccine details.

### Update a Vaccine
**PUT** `/vaccines/{vaccine_id}`

- **Description**: Update details of a specific vaccine.
- **Request Body**: Updated vaccine details.
- **Response**: Updated vaccine details.

---

## Vaccination Drives

### Create a Vaccination Drive
**POST** `/vaccination-drives/`

- **Description**: Add a new vaccination drive.
- **Request Body**: Vaccination drive details (e.g., vaccine ID, date, applicable classes, available doses).
- **Response**: Details of the created drive.

### Get All Vaccination Drives
**GET** `/vaccination-drives/`

- **Description**: Retrieve a list of all vaccination drives.
- **Response**: List of vaccination drives.

### Get a Single Vaccination Drive
**GET** `/vaccination-drives/{drive_id}`

- **Description**: Retrieve details of a specific vaccination drive by ID.
- **Response**: Vaccination drive details.

### Update a Vaccination Drive
**PUT** `/vaccination-drives/{drive_id}`

- **Description**: Update details of a specific vaccination drive.
- **Request Body**: Updated vaccination drive details.
- **Response**: Updated drive details.

### Export Vaccination Drive as CSV
**GET** `/vaccination-drives/{drive_id}/export/csv`

- **Description**: Export details of a vaccination drive as a CSV file.
- **Response**: CSV file.

### Export Vaccination Drive as PDF
**GET** `/vaccination-drives/{drive_id}/export/pdf`

- **Description**: Export details of a vaccination drive as a PDF file.
- **Response**: PDF file.

### Export Vaccination Drive as Excel
**GET** `/vaccination-drives/{drive_id}/export/excel`

- **Description**: Export details of a vaccination drive as an Excel file.
- **Response**: Excel file.

---

## Dashboard

### Get Dashboard Metrics
**GET** `/dashboard/`

- **Description**: Retrieve metrics for the dashboard.
- **Response**: Dashboard metrics.

---

## Healthcheck

### Healthcheck Endpoint
**GET** `/health`

- **Description**: Check the health of the API and database connection.
- **Response**: Status of the API.

---

## Notes
- All endpoints (except `/auth/login` and `/health`) require authentication.
- Use the access token obtained from `/auth/login` in the `Authorization` header as a Bearer token for authenticated requests.