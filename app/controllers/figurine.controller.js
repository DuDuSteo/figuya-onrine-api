const db = require("../models");
require("dotenv").config();

const Figurine = db.figurines;
const Image = db.images;

const addFigurine = (req, res) => {
	try {
		console.log({
			body: req.body,
			images: req.files,
		});

		Figurine.create({
			name: req.body.name,
			origin: req.body.origin,
			company: req.body.company,
			type: req.body.type,
			condition: req.body.condition,
			price: req.body.price,
		})
			.then((figurine) => {
				if (figurine) {
					const promises = req.files.map((element) => {
						return Image.create({
							path:
								process.env.API_URL +
								"/static/" +
								element.filename,
						}).then((image) => {
							return figurine.addImage(image);
						});
					});
					Promise.all(promises).then(() => {
						res.send({
							message: `Figurine ${figurine.name} was created successfully!`,
						});
					});
				}
			})
			.catch((err) =>
				res.status(500).send({
					message: `Could not create figurine in database: ${err}`,
				})
			);
	} catch (err) {
		if (err.code == "LIMIT_FILE_SIZE") {
			return res.status(500).send({
				message: "File size cannot be larger than 2MB!",
			});
		}

		res.status(500).send({
			message: `Could not upload the file: ${req.files}. ${err}`,
		});
	}
};

module.exports = {
	addFigurine,
};
