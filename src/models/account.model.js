const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    status:{
        enum:['ACTIVE','FROZEN','CLOSED'],
        type: String,
        default: 'ACTIVE'
    },
    currency:{
        type: String,
        required: true,
        default: 'BDT'
    }

},{timestamps: true});

accountSchema.index({user: 1,status: 1});
const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;