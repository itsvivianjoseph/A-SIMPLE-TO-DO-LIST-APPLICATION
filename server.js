const express = require("express")
const bodyparser = require("body-parser")

const app = express()

app.set('view engine', 'ejs')

var items = ["buy food","cook food","eat food"]
var worklistitems = []

app.use(bodyparser.urlencoded({extended:true}))

app.use(express.static("public"))

app.get("/",function(req,res){

    var today = new Date();

    var options = {weekday : "long" , day : "numeric" , month : "long"}

    var day = today.toLocaleDateString("en-US",options)

    res.render("list", {
        listtitle: day,
        newlistitems: items
    })
})

app.post("/",function(req,res){

    var item = req.body.newitem

    if(req.body.list==="worklist")
    {
        worklistitems.push(item)
        res.redirect("/work")
    }
    else{
        items.push(item)
        res.redirect("/")
    }
                                
})

app.get("/work",function(req,res){

    res.render("list",{ 
        listtitle: "worklist", 
        newlistitems: worklistitems 
    })

})
                          
app.post("/work",function(req,res){

    var item = req.body.newitem
    worklistitems.push(item)
    res.redirect("/work")

})

app.listen(3000,function(){
    console.log("your listening on port 3000")
})