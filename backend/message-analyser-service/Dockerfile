# ===============================
# backend/fastapi-service/Dockerfile
# ===============================

# 1. Use a lightweight Python base image
FROM python:3.10-slim

# 2. Set a working directory inside the container
WORKDIR /app

# 3. Copy requirements.txt first and install dependencies
COPY requirements.txt .

# Prevent pip from writing .pyc files and use a local cache
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the rest of your application code
COPY . .

# 5. Expose port 8002 (the port Uvicorn will listen on)
EXPOSE 8002

# 6. Specify the default command to run your FastAPI app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
