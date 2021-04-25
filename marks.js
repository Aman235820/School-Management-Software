const mongoose=require('mongoose');

const mrkSchema= new mongoose.Schema({

	Name:{
		type:String,
		required:true
	},
	Identity:{
		type:String,
		required:true
	},
	Physics:{
		type:Number,
		required:true
	},
	Chemistry:{
		type:Number,
		required:true
	},
	Mathematics:{
		type:Number,
		required:true
	},
	Percentage:{
		type:Number,
		required:true
	}
	

});



const Marks= new mongoose.model("Mark",mrkSchema);

module.exports=Marks;