# FlowForge-AI Backend

This is the FastAPI backend for FlowForge-AI. It uses a structured architecture suitable for scalable applications.

## Prerequisites
- Python 3.9+
- pip (Python package installer)

## Setup Instructions

Follow these steps to get your backend up and running locally.

### 0. Navigate to the Backend Directory
Make sure your terminal is in the `backend` directory before running any commands:
```bash
cd backend
```

### 1. Create a Virtual Environment
It's highly recommended to use a virtual environment to manage your dependencies.

**Windows:**
```bash
python -m venv venv
```

**macOS/Linux:**
```bash
python3 -m venv venv
```

### 2. Activate the Virtual Environment

**Windows:**
```bash
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
Once your virtual environment is active, install the required packages:

```bash
pip install -r requirements.txt
```

### 4. Run the Application
You can start the FastAPI server using Uvicorn. The main application is located in the `app` directory.

```bash
uvicorn app.main:app --reload
```
*(The `--reload` flag enables auto-reloading so the server restarts when you make code changes).*

## Accessing the API

Once the server is running, you can access:
- **API Root**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Swagger Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) (Auto-generated UI for your endpoints)
- **ReDoc Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Project Structure

This backend is currently a **clean skeleton structure**. The `app/` directory is organized logically, and inside each folder, you'll find an `__init__.py` file with documentation explaining its purpose:

- `app/main.py`: The entry point for the FastAPI application.
- `app/routes/`: Contains all API route definitions (endpoints).
- `app/controllers/`: Contains the business logic that the routes will call.
- `app/config/`: Configuration for external middlewares, DB connection logic, and environment variables.
- `app/middlewares/`: Custom middlewares for requests and responses.
- `app/models/` & `app/schemas/`: Database models and Pydantic validation schemas.

### Environment Variables
An `.env.example` file is provided in the `backend/` directory. Copy it to `.env` to configure your local environment safely.
