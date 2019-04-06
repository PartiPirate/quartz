from . import _QZComponent

class SpeakerCard(_QZComponent.QZComponent):
	"""docstring for SplashScreen"""
	def __init__(self):
		super(SpeakerCard, self).__init__(QZCOMPONENT['name'])

		# Initial state
		self.QZset_state({
			"presets": [
				{"name": "Florie Marie","role":"Abc"},
				{"name": "zzz","role":"Ddef"},
			]
		})

		def show_req(data):
			# A bit hackish but we don't want to push the state change to every client, because they get the show/hide event already
			data['active'] = True
			self.QZget_state()['current'] = data
			
			self.QZsend('show', data)


		self.QZon('show_req', show_req)


		def hide_req(data):
			# A bit hackish but we don't want to push the state change to every client, because they get the show/hide event already
			self.QZget_state()['current'] = {'active': False}

			self.QZsend('hide')
			pass
		self.QZon('hide_req', hide_req)


QZCOMPONENT = {
	"name": "speaker-card",
	"class": SpeakerCard
}
