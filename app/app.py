from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import uuid

from modules import QZRoom

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


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

if __name__ == '__main__':
    socketio.run(app)