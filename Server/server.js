require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./Schemas/schemas.js");
const mongoose = require("mongoose");

try {
	mongoose.connect(process.env.mongodb_url);
	console.log("Connected to MongoDB");
} catch (error) {
	console.log(error.message);
}

const app = express();
const PORT = process.env.PORT || 5500;

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);

app.listen(PORT, () => {
	console.log("Server Running on port " + PORT);
});
