const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesUser = {
    values: ['SUPER_ROLE', 'ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE}, it is not a valid rol'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    contact: {
        email: {
            type: String,
            unique: true,
            required: [true, 'El correo es necesario']
        },
        google: {
            type: Boolean,
            default: false
        },
        tel: {
            type: String,
            default: '9999999999'
        },
        job: {
            type: String,
            default: 'Godinez'
        }
    },
    password: {
        type: String,
        required: [true, 'Clave requerida'],
        hide: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesUser
    },
    state: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function() {
    let adminObject = this.toObject();
    delete adminObject.password;

    return adminObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);