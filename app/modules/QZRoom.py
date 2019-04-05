from .components import SplashScreen # fixme dynamic import

from flask_socketio import send, emit


class Room(object):
	"""docstring for Room"""
	def __init__(self, room_id):
		self._room_id = room_id
		self._components = {}

		# TODO dynamic component import 
		self._components[SplashScreen.QZCOMPONENT['name']] = SplashScreen.QZCOMPONENT['class']()
		self._components[SplashScreen.QZCOMPONENT['name']]._room = self

		print(self._components)

	def get_key(self):
		return self._room_id

	def get_room_id(self):
		return self._room_id

	def dump_info(self):
		return {
			"key": self._room_id,
			"my info":"mlkqsjd"
		}

	def send(self, component_name, message_identifier, data):
		emit("message", {"component_name": component_name, "message_identifier": message_identifier, "data": data}, room=self._room_id)

	def recv(self, msg):
		if ('component_name' not in msg or 'message_identifier' not in msg):
			return

		if (msg['component_name'] not in self._components):
			print('Received message for unknown component: ',msg)
			return
		
		if ('data' not in msg):
			msg['data'] = None


		self._components[msg['component_name']].QZdispatch(msg['message_identifier'], msg['data'])