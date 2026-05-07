const mongoose=require('mongoose');


const transactionSchema=new mongoose.Schema({
     fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:true,
        index:true
     },
     toAccount:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'account',
     required:true, 
    },
    status:{
        type:String,
        enum:{values:['pending','completed','failed'],
            message
            :'status should be either pending,completed or failed'
        },
        default:'pending'
        
    },
    amount:{
        type:Number,
        required:true,
        },

   idempotencyKey:{
    type:String,
    required:true,
    unique:true,
    index:true
    
     }


  })


  const transactionModel=mongoose.model('transaction',transactionSchema);

  module.exports=transactionModel;