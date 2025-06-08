FROM python:3.10-slim

WORKDIR /app

# 1. Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy source code, .env, and Firebase key
COPY . .

# 3. Expose port (8003)
EXPOSE 8003

# 4. Run the service
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8003"]