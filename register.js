const mongoose=require('mongoose');

const stdSchema= new mongoose.Schema({
	firstName:{
		type:String,
		required:true
	},
	lastName:{
		type:String,
		required:true
	},
	mobileNumber:{
		type:Number,
		required:true
	},
	age:{
		type:Number,
		required:true
	},
	gender:{
		type:String,
		require:true
	},
	emailAddress:{
		type:String,
		require:true
	},
	password:{
		type:String,
		require:true
	},
	address:{
		type:String,
		require:true
	},
	image:{
		type:String,
		require:true
	}

});



const Record= new mongoose.model("Record",stdSchema);

module.exports=Record;