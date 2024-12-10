const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,    
  },
  accountHolder: {
    type: String,
    required: true,
  },
  proofOfPayment: {
    public_id:String,
    url:String 
  },


}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
