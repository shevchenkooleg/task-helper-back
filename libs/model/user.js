const mongoose = require('mongoose'),
    crypto = require('crypto'),

    Schema = mongoose.Schema,

    User = new Schema({
        username: {
            type: String,
            unique: true,
            required: true
        },
        hashedPassword: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        },
        roles: {
            type: [String],
            default: ['USER']
        },
        userCredentials: {
            firstName: {type: String},
            lastName: {type: String},
        }
    });

User.methods.encryptPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () { return this._plainPassword; });


User.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

//Update password
User.methods.updatePassword = function (newPassword) {
    const newHashedPassword = this.encryptPassword(newPassword)
    this.hashedPassword = newHashedPassword
    return newHashedPassword
}

module.exports = mongoose.model('User', User);
