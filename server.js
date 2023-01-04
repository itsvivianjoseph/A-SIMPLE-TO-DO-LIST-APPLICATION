const express = require("express")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const app = express()

app.set('view engine', 'ejs')

app.use(bodyparser.urlencoded({extended:true}))

app.use(express.static("public"))

mongoose.set('strictQuery',false);
mongoose.connect("mongodb+srv://admin:starboysass@cluster0.kc6dwof.mongodb.net/todolistDB",{useNewUrlParser:true})

const itemsSchema  = {
    name : String
}

const Item = mongoose.model("Item",itemsSchema)

const item1 = new Item({
    name : "cook food"
})

const item2 = new Item({
    name : "eat food"
})

const item3 = new Item({
    name : "buy groceries"
})

const defaultItems = [item1,item2,item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
} 

const List = mongoose.model("List",listSchema)

var today = new Date();

var options = {weekday : "long" , day : "numeric" , month : "long"}

var day = today.toLocaleDateString("en-US",options)

app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems){
  
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function(err){
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to DB.");
          }
        });
        res.redirect("/");
      } 
      else 
      {
        res.render("list", {listTitle: day, newListItems: foundItems});
      }
    });
  
  });

  app.post("/", function(req, res){

    const itemName = req.body.newItem;
    const listName = req.body.list;
  
    const item = new Item({
      name: itemName
    });
  
    if (listName === day){
      item.save();
      res.redirect("/");
    } else {
      List.findOne({name: listName}, function(err, foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      });
    }
  });

  app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
  
    if (listName === day) {
      Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
          console.log("Successfully deleted checked item.");
          res.redirect("/");
        }
      });
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + listName);
        }
      });
    }
});

app.get("/:customListName", function(req, res){
    const customListName = req.params.customListName;
  
    List.findOne({name: customListName}, function(err, foundList){
      if (!err){
        if (!foundList){
          //Create a new list
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          //Show an existing list
          res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
      }
    });
  });


app.listen(3000,function(){
    console.log("your listening on port 3000")
})