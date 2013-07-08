
var mongoose = require('mongoose');
var CustomerSchema = require('../schemas/cliente');
var Cliente = mongoose.model('cliente', CustomerSchema);

module.exports = Cliente;
