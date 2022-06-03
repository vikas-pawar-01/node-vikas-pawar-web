const path = require('path');
const fs = require('fs');

const getUsers = (req, res, next) => {
    const data = fs.readFileSync('./data.json', { encoding: 'utf8', flag: 'r' });
    res.send(data);
};

exports.getUsers = getUsers;