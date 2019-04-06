class QZComponent(object):
	"""docstring for QZComponent"""
	def __init__(self, name):
		self._QZhandlers = {}
		self._QZname = name
		self._room = None
		self._QZstate = {}

		# Answer to get-state requests
		def fn(data):
			self.QZsend('state', self.QZget_state())
		self.QZon('get-state', fn)

		# Answer to set-state requests
		def fn(data):
			self.QZset_state(data)
		self.QZon('set-state',fn)
		

	def QZon(self, message_identifier, callback):
		self._QZhandlers[message_identifier] = callback
		print('[{}] Registered handler for message {}'.format(self._QZname, message_identifier))

	def QZdispatch(self, message_identifier, data):
		if (message_identifier in self._QZhandlers):
			self._QZhandlers[message_identifier](data)
		else:
			print('[{}] Received unknown message: {}'.format(self._QZname, message_identifier))

	def QZsend(self, message_identifier, data):
		if (self._room):
			self._room.send(self._QZname, message_identifier, data)
			pass

	def QZget_state(self):
		return self._QZstate

	def QZset_state(self, data):
		self._QZstate = data
		self.QZsend('state', self._QZstate)