const { Schema, default: mongoose } = require("mongoose");
const Client = require("./Client");

const projectSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	status: {
		type: String,
		enum: ["Not Started", "In Progress", "Completed"],
	},
	client: {
		type: Schema.Types.ObjectId,
		ref: Client,
	},
});
const Projects = new mongoose.model("Projects", projectSchema);
module.exports = Projects;
