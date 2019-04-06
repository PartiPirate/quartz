from . import _QZComponent

class SpeakerCard(_QZComponent.QZComponent):
	"""docstring for SplashScreen"""
	def __init__(self):
		super(SpeakerCard, self).__init__(QZCOMPONENT['name'])

		# Initial state
		"""
		self.QZset_state({
			"topic": "zzzz", #Conférence de presse du Parti Pirate pour les élections européennes
			"showDate": True
		})
		"""

		def show_req(data):
			self.QZsend('show', data)
			data['active'] = True
			self.QZset_state(data)
			pass
		self.QZon('show_req', show_req)


		def hide_req(data):
			self.QZset_state({"active":"False"})
			self.QZsend('hide')
			pass
		self.QZon('hide_req', hide_req)


QZCOMPONENT = {
	"name": "speaker-card",
	"class": SpeakerCard
}
