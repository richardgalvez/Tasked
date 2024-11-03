FROM python:3.12.7-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y \
    net-tools

COPY requirements.txt requirements.txt

RUN pip install --upgrade pip

# RUN pip install Cython numpy RUST

RUN pip install --no-cache-dir --upgrade -r requirements.txt

# RUN pip install fastapi uvicorn sqlalchemy psycopg2-binary

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]