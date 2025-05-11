# Vaxify Backend

This is the backend service for the Vaxify application. It provides APIs for managing vaccination-related data and operations.

## Prerequisites

- Python (v3.8 or higher)
- MySQL (running locally or accessible remotely)

## Getting Started

Follow these steps to run the backend locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/soorya-bits/vaxify.git
    cd vaxify/backend
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

## Scripts

- `uvicorn main:app --reload`: Start the server in development mode with hot-reloading.
- `uvicorn main:app`: Start the server in production mode.

## Folder Structure

- `app/`: Contains the source code.
  - `routes/`: API routes.
  - `models/`: Database models.
  - `schemas/`: Pydantic schemas.
  - `actions/`: API actions.
  - `utils/`: Utility functions.

## License

This project is licensed under the MIT License. Vaxify Backend
