/* ================================= SETUP ================================= */

const mongoose  = require('mongoose');


/* ================================ SCHEMA ================================= */

const postSchema = new mongoose.Schema({
    
    active : {
        type     : Boolean,
        default  : true
    },
    
    author : {
        type     : String,
        required : true
    },
    
    author_id : {
        type     : String,
        required : true
    },
    
    availability : {
        type     : String,
        trim     : true
    },
    
    body : {
        type     : String,
        required : true,
        trim     : true
    },
    
    keywords : {
        type     : [String],  // array of strings
        required : true       // at least 1 element required
    },
    
    role : {
        type     : String,
        enum     : ['mentor', 'mentee'],
        default  : 'mentee',
        trim     : true
    },
    
    title : {
        type     : String,
        required : true,
        trim     : true
    },
    
    deleted : {
        type     : Boolean,
        default  : false
    }

},
{
    timestamps : true
});


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Post', postSchema);

