FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependencias
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r /app/requirements.txt

# Copia el código
COPY . /app

# Variables por defecto (pueden ser sobrescritas por Railway)
ENV PORT=8000

# Pre-collectstatic (requiere SECRET_KEY; Railway env vars pueden sobrescribir en tiempo de build)
RUN python manage.py collectstatic --noinput || true

CMD ["gunicorn", "coachvirtualback.wsgi:application", "--bind", "0.0.0.0:8000"]
