FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install a specific version of ultralytics
RUN pip install ultralytics==8.3.18

COPY . .

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]