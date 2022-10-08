const { ApolloServer, gql } = require('apollo-server');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const db = require("./models");


db.sequelize.sync()
	.then(() => {
		console.log("sync db");
	})
	.catch((err) => {
		console.log("error: " + err.message);
	});

const News = db.news;
const User = db.users;
const Comments = db.comments
const Op = db.Sequelize.Op;

const resolvers = {
	Query: {
		news: () => {
			return News.findAll()
				.then(news => {
					return news;
				})
				.catch(err => {
					return [];
				});
		},
		users: (parent, args, context) => {
			//console.log(context.data.id);
			if (!context.data) 
				return [];
			else
				return User.findAll()
					.then(users => {
						return users;
					})
					.catch(err => {
						return [];
					});
		},
        comments: () => {
			return Comments.findAll()
				.then(comments => {
					return comments;
				})
				.catch(err => {
					return [];
				});
		},
		getNews: (parent, { id }) => {
			var id = id;
      
			return News.findOne({	
				where: {
					id: id,
				  },
			})
				.then(detailNews => {
					if (detailNews) {
						return detailNews
					} else {
						return {};
					}       
				})
				.catch(err => {
					return {};
				});
		},
		
	},

	Mutation: {
		createNews: (parent, { title, image, berita }, context) => {
			if (!context.data) 
				return [];
			else 
				var news = {
					title: title,
					image: image,
					berita: berita
				}
				return News.create(news)
					.then(data => {
						return data;
					})
					.catch(err => {
						return {};
					});
			
		},

	

        createComment: (parent, { id, name, comment }, context) => {
			var comments = {
				idnews : id,
				name: name,
				comment: comment
			}
			return Comments.create(comments)
				.then(data => {
					return data;
				})
				.catch(err => {
					return {};
				});
		},

		updateNews: (parent, { id, title, image, berita }, context) => {
			if (!context.data) 
				return [];
			else 
				var news = {
					title: title,
					image: image,
					berita: berita
				}
				return News.update(news, {
					where: { id: id }
				})
					.then(num => {
						if (num > 0) {
							return {
								id: id,
								title: title,
								image: image,
								berita: berita
							}
						} else {
							return {};
						}
					})
					.catch(err => {
						return {};
					});
			
		},

		deleteNews: (parent, { id }, context) => {
			if (!context.data) 
				return [];
			else 
			return News.findByPk(id)
				.then(detailNews => {
					if (detailNews ) {
						return News.destroy({
							where: { id: id }
						})
							.then(num => {
								return detailNews ;
							})
							.catch(err => {
								return {};
							});
					} else {
						return {};
					}
				})
				.catch(err => {
					return {};
				});

		},


		register: (parent, { name, email, username, password }) => {
			var hashpass = bcrypt.hashSync(password, 8);
			var user = {
				name: name,
				email: email,
				username: username,
				password: hashpass
			}
			return User.create(user)
				.then(data => {
					return data;
				})
				.catch(err => {
					return {};
				});
		},
		login: (parent, { username, password }) => {

			return User.findOne({ where: { username: username } })
				.then(data => {
					if (data) {
						var loginValid = bcrypt.compareSync(password, data.password);
						if (loginValid) {

							var payload = {
								userid: data.id,
								username: username
							};
							let token = jwt.sign(
								payload,
								config.secret, {
									expiresIn: '24h'
								}
							);
							let dt = new Date(); // now
							dt.setHours(dt.getHours() + 24); // now + 24h

							return {
								success: true,
								token: token,
								expired: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()
							};
						} else {
							return {};
						}
					} else {
						return {};
					}
				})
				.catch(err => {
					console.log(err);
					return {};
				});
		},

	}
};


const {
	ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const fs = require('fs');
const path = require('path');
const typeDefs = fs.readFileSync("./schema.graphql", "utf8").toString();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	csrfPrevention: true,
	cache: 'bounded',
	context: ({ req }) => {

		const token = req.headers.authorization || '';
		//console.log(token);
		if(token){
			// extract
			//jwt.decode(token,config.pubkey)
			var payload = jwt.verify(token, config.secret, {
				expiresIn: '24h'
			})
			// var payload = jwt.verify(token,config.pubkey);
			//console.log(payload);
			return User.findByPk(payload.userid)
					.then(data => {
						//console.log(data);
						if(data){
							return {data};
						}else{
							// http 404 not found
							return {};
						}
						
					})
					.catch(err => {
						return {};
					});
			// jwt.verify(token,config.pubkey,function(err,payload){
			// 		console.log(payload);
			// 		User.findByPk(payload.userid)
			// 		.then(data => {
			// 			if(data){
			// 				return {data};
			// 			}else{
			// 				// http 404 not found
			// 				return {};
			// 			}
						
			// 		})
			// 		.catch(err => {
			// 			return {};
			// 		});
			// })
			
		}else{
			return {};
		}
	},	
	plugins: [
		ApolloServerPluginLandingPageLocalDefault({ embed: true }),
	],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});  