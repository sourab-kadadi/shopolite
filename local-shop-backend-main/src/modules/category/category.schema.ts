import * as mongoose from 'mongoose';
var media = new mongoose.Schema({ 
   filePath:{
       type: String,
       required: true
   }, type: {
    type: String,
    required: true,
}});

var idProof = new mongoose.Schema({
    idName: {
        type: String
    },
    total: {
        type: Number
    },
    noOfRequired: {
        type: Number
    }
})
export const category = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
       },
    // type: {
    //     type: String,
    //     required: true,
    // },
    image: {
        type: media,
        required: true,
        },
    media: {
        type: [media],
        default: undefined
        },
    status: {
        type: Boolean,
        default: false
    },
    manualRanking: {
        type: Number,
        unique: true,
       },
    isActiveUser: {
        type: Boolean,
        default: false
    },
    isStoreInventorty: {
        type: Boolean,
        default: false
    }
 });


 category.index({name: 1}, {unique: true});
 category.index({name: 'text'});



 category.on('index', function(error) {
    console.log(error.message);
  });