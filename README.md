# Vaxify
A web-based vaccine tracking system designed for school vaccination management. This system allows school coordinators to manage student records, schedule vaccination drives, update statuses, and generate reports. The frontend is built with React, the backend is powered by Python FastAPI, and MySQL is used for data persistence.
## Directory Structure

```
Vaxify/
├── backend/                # Python FastAPI backend code
├── frontend/               # React frontend code
├── api-documentation.md    # API Documentation
├── docker-compose.yml      # Docker compose file
└── README.md               # Project overview and setup instructions
```

## Technologies Involved

- **Frontend**: React, JavaScript, HTML, CSS
- **Backend**: Python, FastAPI
- **Database**: MySQL
- **Others**: Docker (for containerization), Git (version control)

## Installation Guide

### Prerequisites

#### For Docker Setup (Preferred Method)
- Docker: Install Docker from [Docker's official website](https://www.docker.com/).

#### For Manual Setup (Optional)
- Node.js: Required for the frontend.
- Python 3.9+: Required for the backend.
- MySQL: Required for the database.

### Preferred Method: Using Docker

1. **Ensure Docker is Installed**
    - Install Docker from [Docker's official website](https://www.docker.com/).

2. **Clone the Repository**
    ```bash
    git clone https://github.com/soorya-bits/vaxify.git
    cd vaxify
    ```

3. **Build and Run the Containers**
    ```bash
    docker-compose up -d --build
    ```

4. **Access the Application**
    - Frontend: `http://localhost`
    - Backend API: `http://localhost:8000`

### Optional: Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Create a `.env` file in the root directory and add the following variables:
    ```
    DATABASE_URL=mysql+pymysql://<mysqlusername>:<mysqlpassword>@<mysqlhost>:<mysqlport>/vaxify
    DEFAULT_ADMIN_PASSWORD=admin123
    ```

    - `DATABASE_URL`: Connection string for the MySQL database.
    - `DEFAULT_ADMIN_PASSWORD`: Default password for the automated admin user created on boot.

3. Set up a Python virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

4. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5. Run the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
    The server will start on `http://127.0.0.1:8000`.

#### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

#### Access the Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

## Features

- Manage student vaccination records.
- Schedule and track vaccination drives.
- Generate detailed reports.
- User-friendly interface for school coordinators.

## License

This project is licensed under the MIT License.