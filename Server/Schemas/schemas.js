const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLEnumType,
} = require("graphql");
const jwt = require("jsonwebtoken");
const Clients = require("../models/Client");
const Projects = require("../models/Project");

const ProjectType = new GraphQLObjectType({
	name: "Project",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		status: { type: GraphQLString },
		client: {
			type: ClientType,
			resolve: (parent) => {
				return Clients.findById(parent.client).then((client) => client);
			},
		},
	}),
});
const JWTToken = new GraphQLObjectType({
	name: "JWTToken",
	fields: () => ({
		token: { type: GraphQLString },
		success: { type: GraphQLBoolean },
		info: { type: GraphQLString },
	}),
});
const ClientType = new GraphQLObjectType({
	name: "Client",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
	}),
});

const query = new GraphQLObjectType({
	name: "Query",
	fields: {
		Client: {
			type: ClientType,
			args: { id: { type: GraphQLID } },
			resolve: (parent, args, context) => {
				console.log(args);
				return Clients.findById(args.id).then((client) => client);
			},
		},
		Clients: {
			type: new GraphQLList(ClientType),
			resolve: () => {
				return Clients.find().then((clients) => clients);
			},
		},

		Project: {
			type: ProjectType,
			args: { id: { type: GraphQLID } },
			resolve: (parent, args) => {
				return Projects.findById(args.id).then((project) => project);
			},
		},

		Projects: {
			type: new GraphQLList(ProjectType),
			resolve: () => {
				return Projects.find().then((projects) => projects);
			},
		},
		login: {
			type: JWTToken,
			args: {
				email: { type: GraphQLNonNull(GraphQLString) },
				password: { type: GraphQLNonNull(GraphQLString) },
			},
			resolve: async (parent, args) => {
				const user = await Clients.findOne({ email: args.email });
				console.log(user);
				if (!user) {
					return {
						token: undefined,
						success: false,
						info: "Username or Password Mismatch",
					};
				}

				const token = jwt.sign(user.email, process.env.SECRET);
				return { token, success: true, info: "Logged in successfully" };
			},
		},
	},
});

const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addProject: {
			type: ProjectType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				description: { type: GraphQLNonNull(GraphQLString) },
				status: {
					type: new GraphQLEnumType({
						name: "ProjectStatus",
						values: {
							new: { value: "Not Started" },
							started: { value: "In Progress" },
							completed: { value: "Completed" },
						},
					}),
				},
				clientId: { type: GraphQLID },
			},
			resolve: (parent, args) => {
				return Projects.create({
					name: args.name,
					description: args.description,
					status: args.status,
					client: args.clientId,
				}).then((project) => project);
			},
		},
		updateProject: { type: ProjectType },
		deleteProject: { type: ProjectType },
		addClient: {
			type: ClientType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				email: { type: GraphQLNonNull(GraphQLString) },
				phone: { type: GraphQLNonNull(GraphQLString) },
			},
			resolve: (parent, args) => {
				return Clients.create({
					name: args.name,
					email: args.email,
					phone: args.phone,
				}).then((client) => client);
			},
		},
		updateClient: { type: ClientType },
		deleteClient: { type: ClientType },
	},
});

module.exports = new GraphQLSchema({
	query,
	mutation,
});
