from . import _QZComponent

class VideoEmbed(_QZComponent.QZComponent):
	"""docstring for SplashScreen"""
	def __init__(self):
		super(VideoEmbed, self).__init__(QZCOMPONENT['name'])

		# Initial state
		self.QZset_state({
			"playing": False,
			"visible": False
		})

		# Handlers
		# Show video
		def fn(data):
			self.QZsend('show', data)
		self.QZon('show', fn)

		# Hide video
		def fn(data):
			self.QZsend('hide')
		self.QZon('hide', fn)

		# Set volume
		def fn(data):
			self.QZsend('set-volume', data)
		self.QZon('set-volume', fn)
		
		# Play/pause
		def fn(data):
			self.QZsend('play')
		self.QZon('play', fn)
		
		def fn(data):
			self.QZsend('pause')
		self.QZon('pause', fn)


QZCOMPONENT = {
	"name": "video-embed",
	"class": VideoEmbed
}
