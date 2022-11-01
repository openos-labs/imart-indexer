FROM python:3

WORKDIR /app/event-worker

COPY requirements.txt ./
RUN pip3 install -r requirements.txt
COPY . .