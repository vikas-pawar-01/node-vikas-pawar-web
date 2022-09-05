const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    name: { type: String, required: true }
});

todoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Todo', todoSchema);