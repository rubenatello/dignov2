#!/usr/bin/env sh
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput

if [ "$DEBUG" = "1" ] || [ "$DEBUG" = "true" ]; then
  echo "Starting Django dev server..."
  exec python manage.py runserver 0.0.0.0:8000
else
  echo "Starting gunicorn..."
  exec gunicorn digno.wsgi:application --bind 0.0.0.0:8000 --workers ${GUNICORN_WORKERS:-3} --timeout ${GUNICORN_TIMEOUT:-60}
fi
