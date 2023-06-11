FROM python:3

WORKDIR /app/indexer-apt

COPY requirements.txt ./
RUN pip3 install -r requirements.txt
COPY . .