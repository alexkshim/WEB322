const mongoose = require('mongoose'); 
let Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var contentSchema = new Schema({
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "postedDate": Date,
    "commentText": String,
     "replies": [{
        "_id": String,
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "commentText": String,
        "repliedDate": Date
     }]
});

let Comment = mongoose.model("web322_a6", contentSchema);

var dbLink = "mongodb://<dbuser>:<dbpassword>@ds139899.mlab.com:39899/web322_a6";

module.exports.initialize = function () {     
    return new Promise(function (resolve, reject) {         
        let db = mongoose.createConnection(dbLink); 
        db.on('error', (err) => {             
            reject(err); // reject the promise with the provided error         
        });         
        db.once('open', () => {            
            Comment = db.model("comments", commentSchema);            
            resolve();         
        });     
    }); 
};

module.exports.addComment = (data) => {
    data.postedDate = Date.now();
    return new Promise((resolve, reject) => {
        var newComment = new Comment(data);
        newComment.save((err) => {
            if(err) {
                reject("There was an error saving the comment: " + err);
            } else {
                console.log(data);
                console.log("Comment object id from addComent: " + newComment._id);
                resolve(newComment._id);
            }
        });
    });
};

module.exports.getAllComments = () => {
    return new Promise((resolve, reject) => {
        Comment.find().sort({postedDate:1}).exec().then((data) => {
            resolve(data);
        }).catch((err) => {
            console.log("Error: " + err);
        });
    });
};

module.exports.addReply = (data) => {
    data.repliedDate = Date.now();
    return new Promise((resolve, reject) => {
        if (data._id == data.comment_id) {
            Comment.update({ _id: data.comment_id}, { $addToSet: { replies: data} }, { multi: false }).exec();
            resolve(data);
        }
    }).catch((err) => {
        reject("Error");
    });
};