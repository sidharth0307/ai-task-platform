# Stage 1: Builder
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
# Install dependencies to a local user directory
RUN pip install --user -r requirements.txt

# Stage 2: Production
FROM python:3.11-slim
WORKDIR /app

# Create and switch to non-root user
RUN useradd -m workeruser
USER workeruser

# Copy installed dependencies from builder
COPY --from=builder /root/.local /home/workeruser/.local
ENV PATH=/home/workeruser/.local/bin:$PATH

# Copy application code and assign ownership
COPY --chown=workeruser:workeruser . .

# -u flag forces stdin, stdout and stderr to be totally unbuffered
CMD ["python", "-u", "main.py"]