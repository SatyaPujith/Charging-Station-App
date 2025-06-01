const mongoose = require('mongoose');

   const chargerSchema = new mongoose.Schema({
     name: { type: String, required: true },
     location: {
       latitude: { type: Number, required: true },
       longitude: { type: Number, required: true },
     },
     status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
     powerOutput: { type: Number, required: true },
     connectorType: { type: String, required: true },
     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add this
   });

   module.exports = mongoose.model('Charger', chargerSchema);