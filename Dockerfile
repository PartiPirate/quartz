FROM python:3.7
COPY ./app/requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt
COPY ./app /app
WORKDIR /app
CMD [ "python", "-u", "app.py" ]