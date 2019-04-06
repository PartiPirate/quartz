from . import _QZComponent

class PPHeader(_QZComponent.QZComponent):
	"""docstring for SplashScreen"""
	def __init__(self):
		super(PPHeader, self).__init__(QZCOMPONENT['name'])

		# Initial state
		self.QZset_state({
			"topic": "zzzz", #Conférence de presse du Parti Pirate pour les élections européennes
			"showDate": True
		})


QZCOMPONENT = {
	"name": "pp-header",
	"class": PPHeader
}
