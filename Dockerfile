FROM python:3

WORKDIR /app/event-worker

COPY requirements.txt ./
RUN pip3 install -r requirements.txt
COPY . .

CMD ["/bin/bash", "-c","prisma generate && python3 ./main.py"]