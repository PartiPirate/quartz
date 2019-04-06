from . import _QZComponent

class SplashScreen(_QZComponent.QZComponent):
	"""docstring for SplashScreen"""
	def __init__(self):
		super(SplashScreen, self).__init__(QZCOMPONENT['name'])

		# Initial state
		self.QZset_state({
			"translucid": False,
			"music": True,
			"text": 'On arrive très vite.',
			"countdown": 0,
			"name": '<span class="thin">parti</span><span class="bold">pirate</span><span class="thin">.org</span>'
		})


		# Handlers
		def fn(data):
			print('recv toggle')
			self.QZsend('toggle', {'active': data['active']})
		self.QZon('toggle_request', fn)
		


QZCOMPONENT = {
	"name": "splash-screen",
	"class": SplashScreen
}
