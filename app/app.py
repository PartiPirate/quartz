# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, session, Response
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import uuid

from modules import QZRoom

"""
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
"""

app = Flask(__name__)

socketio = SocketIO(app)
Rooms = {}

@socketio.on('connect')
def on_connect():
	print('Connected!', request.sid)

@socketio.on('disconnect')
def on_disconnect():
	print('Disconnected!', request.sid)


@socketio.on('join')
def on_join_request(data):
	if ('key' in data):
		if (data['key'] in Rooms):
			session.room = Rooms[data['key']]
			join_room(data['key'])

			print('Join: ',data['key'])

			emit('room_info', Rooms[data['key']].dump_info())

@socketio.on('create')
def on_create_request():
	room_id = False
	while (not room_id or room_id in Rooms):
		room_id = str(uuid.uuid4())

	print('Requested room creation:', room_id)

	Rooms[room_id] = QZRoom.Room(room_id)

	emit('new_room',{"key": room_id})


@socketio.on('message')
def on_message(data):
	if (not session.room):
		return
		
	session.room.recv(data)


import json
import requests

@socketio.on('import_state')
def on_import_state(data):
	if (not session.room):
		return

	try:
		if ('url' in data):
			r = requests.get(data['url'])
			state = json.loads(r.text)
		elif ('raw' in data):
			state = json.loads(data['raw'])
		else:
			raise

		session.room.set_state(state)
		emit('import_callback', {"success": True})
	except Exception as e:
		emit('import_callback', {"success": False})


@app.route('/export_state/<room>')
def on_export_state(room):

	room = room.split('.')[0]

	raw = "{}"

	if (room in Rooms):
		raw = json.dumps(Rooms[room].get_state(), indent=2)

	return Response(raw, mimetype="application/octet-stream")


if __name__ == '__main__':
	app.debug = False
	socketio.run(app, host="0.0.0.0", port="5000")