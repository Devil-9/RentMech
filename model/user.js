var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var userSchema = new Schema({
    firstname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    productname: {
        type: String,
        require: true
    },
    model: {
        type: String,
        require: true
    },
    manyear: {
        type: String,
        require: true
    },
    rent: {
        type: String,
        require: true
    },
    plocation: {
        type: String,
        require: true
    },
    rc: {
        type: String,
        require: true
    }

})

userSchema.pre('save', function (next) {
    var user = this;
    if(this.isModified('password') ||  this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if(err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }
    else {
        return next()
    }
})

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)