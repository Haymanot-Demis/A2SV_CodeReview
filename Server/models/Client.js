const { Schema, default: mongoose } = require("mongoose");

const clientSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
});

const Clients = new mongoose.model("Clients", clientSchema);
module.exports = Clients;
