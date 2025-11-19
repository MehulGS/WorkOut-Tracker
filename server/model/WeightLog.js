 const mongoose = require('mongoose');

 const weightLogSchema = new mongoose.Schema(
   {
     user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true,
     },

     weight: {
       type: Number,
       required: true,
     },

     BMI: {
       type: Number,
       required: true,
     },
   },
   { timestamps: true }
 );

 module.exports = mongoose.model('WeightLog', weightLogSchema);
