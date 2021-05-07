const mongoose=require('mongoose');

const messSchema= new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	time:{
		type:String,
		required:true
	},
	identity:{
		type:String,
		required:true
	},
	text:{
		type:String,
		required:true
	}

});

const Messages= new mongoose.model("Message",messSchema);

module.exports=Messages;