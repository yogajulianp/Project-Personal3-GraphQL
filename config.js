const fs = require('fs');
var key = fs.readFileSync('D:/Belajar Software Engineer/Node JS Rapid Tech/projectpersonal3-GraphQL-webBerita-yogaprasutiyo/certs/key.pem');
var pubkey = fs.readFileSync('D:/Belajar Software Engineer/Node JS Rapid Tech/projectpersonal3-GraphQL-webBerita-yogaprasutiyo/certs/pubkey.pem');
var cert = fs.readFileSync('D:/Belajar Software Engineer/Node JS Rapid Tech/projectpersonal3-GraphQL-webBerita-yogaprasutiyo/certs/cert.pem');

module.exports = {
	secret: key,
	pubkey: pubkey,
	cert: cert
}