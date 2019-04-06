from . import _QZComponent

class DonationsGauge(_QZComponent.QZComponent):
	"""docstring for SplashScreen"""
	def __init__(self):
		super(DonationsGauge, self).__init__(QZCOMPONENT['name'])

		# Initial state
		self.QZset_state({
			"active": True,
			"url": "https://don.partipirate.org/api/getGauge.php?from_date=2017-01-01&to_date=2020-01-01&amount_path=project%3EadditionalDonation&search=%22project%22:%7B%22code%22:%22BUD_ELECTION_2019%22",
			"objectives": [
				27000,
				135000,
				270000,
				400000
			],
			"title": "Campagne de dons pour les élections",
			"link": "europeennes.partipirate.org"
		})


QZCOMPONENT = {
	"name": "donations-gauge",
	"class": DonationsGauge
}
