from . import _QZComponent

class PPHeader(_QZComponent.QZComponent):
	"""docstring for SplashScreen"""
	def __init__(self):
		super(PPHeader, self).__init__(QZCOMPONENT['name'])

		# Initial state
		self.QZset_state({
			"topic": "", #Conférence de presse du Parti Pirate pour les élections européennes
			"location": "",
			"showDate": False
		})


QZCOMPONENT = {
	"name": "pp-header",
	"class": PPHeader
}
