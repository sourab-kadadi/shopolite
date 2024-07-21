import * as mongoose from 'mongoose';
var media = new mongoose.Schema({ 
   filePath:{
       type: String,
       required: true
   }, type: {
    type: String,
    required: true,
}});

export const storeType = new mongoose.Schema ({
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
        type: media
        },
    media: {
        type: [media],
        default: undefined
        },
    status: {
        type: Boolean,
        default: true
    }
 });


 storeType.index({name: 1}, {unique: true});
 storeType.index({name: 'text'});



 storeType.on('index', function(error) {
    console.log(error.message);
  });