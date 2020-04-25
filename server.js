//import packages
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const keyHandler =  require('./keyHandler'); //middleware js file 

//execute express
const app = express();

const jsonParser = bodyParser.json();

//packages running on every endpoint
app.use( morgan('dev'));
app.use(keyHandler); //API key handling middleware

let bookmarks = [
    {
      id : uuid.v4(),
      title : "Chocolate cookie recipe",
      description : "My family's favorite cookie recipe",
      url : 'https://www.youtube.com/watch?v=mRuszsJWQXo',
      rating : 10
    },
    {
      id : uuid.v4(),
      title : "Chocolate Brownie Cheescake",
      description : "Tasty's Recipe for my brothers birthday cake",
      url : 'https://tasty.co/recipe/chocolate-fudge-box-brownie-cheesecake?fbclid=IwAR0PwY5pdRJy2cxL41EIusaE5v69CoWo86UPyCgT48K4zKQ4ICYb7oBFFQA',
      rating : 9
    },
    {
      id : uuid.v4(),
      title : "Coconut Banana Crunch Muffins",
      description : "My moms favorite cupcake recipe for family gatherings",
      url : 'https://thenovicechefblog.com/coconut-banana-crunch-muffins/?fbclid=IwAR3mI-Y_8XBvlhNFJsgaDhM15fc9Rj8VaBMi2kmOV_BI4k58xE6jfNyZqRg',
      rating : 8
    },
    {
      id : uuid.v4(),
      title : "Vegan Cheesecake",
      description : "NY Style Strawberry Cheescake",
      url : 'https://biancazapatka.com/en/new-york-cheesecake-recipe-vegan/',
      rating : 6
    }
  ];

  // GET request of all bookmarks
  app.get('/bookmarks', (req,res)=> {
      console.log("Retrieving all bookmarks");
      return res.status(200).json(bookmarks);
  });

  // GET by title requests
  app.get('/bookmark', (req,res)=> {
      console.log("Retrieving bookmark");
      let title = req.query.title;

      //if no title was provided
      if (! title){
        res.statusMessage = "Please provide a title";
      return res.status(406).end();
      }

      //i used filter instead of find because it might not be an unique value 
      let result = bookmarks.filter((bkmark) =>{ 
        if(bkmark.title === title){
            return bkmark
        }
      });
      //if there was no title found...
      if( result.length == 0 ){
        res.statusMessage = `The title '${title}' does not exist`;
        return res.status( 404 ).end();
      }

    return res.status( 200 ).json( result ); 
  });

// POST requests of a bookmark
app.post('/bookmarks', jsonParser ,(req,res)=> {
  console.log("Adding a bookmark")
  console.log("body", req.body);

  let id = uuid.v4();
  let title = req.body.title;
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;

  if(!req.body) {
    res.statusMessage = "Please provide parameters: ";
    return res.status(406).end();
  }
  if(!title || !description || !url || !rating){
    res.statusMessage = "One or more parameters are missing";
    return res.status(406).end();
  }

  let newBookmark = {id,title,description,url,rating};
  bookmarks.push(newBookmark);

  return res.status(201).json(newBookmark);
});

// DELETE : remove requests
app.delete('/bookmark/:id', (req, res) => {
  console.log("Removing bookmark");
  console.log(req.params);

  let id = req.params.id;
  let itemToRemove = bookmarks.findIndex(( bkmark ) => {
    if( bkmark.id === id){
      return true;
    }
  });

  if( itemToRemove < 0 ){
    res.statusMessage = "ID not found";
    return res.status( 404 ).end();
  }

  bookmarks.splice( itemToRemove, 1 );
  return res.status( 200 ).end();
});

// PATCH : update requests
app.patch('/bookmark/:id', jsonParser, (req,res) => {
  //check if the bookmark exists by ID
  if (!req.body.id){
    res.statusMessage = "Please send: title, description, url & rating of bookmark ";
    return res.status(406).end();
  }
  //compare ID in path and param are the same
  if (req.params.id !== req.body.id){
    res.statusMessage = "ID does not match";
    return res.status(409).end();
  }
  //find index in bookmarks list of object to update
  let index = -1;
  for(var i in bookmarks){
    if(bookmarks[i].id === req.body.id){
      index = i;
    }
  }
  if (index === -1){
    res.statusMessage = "ID does not match any existing bookmark";
    return res.status(404).end();
  }
  //if a new value was sent, update them
  if(req.body.title){
    bookmarks[index].title = req.body.title;
  }
  if(req.body.description){
    bookmarks[index].description = req.body.description;
  }
  if(req.body.url){
    bookmarks[index].url = req.body.url;
  }
  if(req.body.rating){
    bookmarks[index].rating = req.body.rating;
  }

  return res.status(202).json(bookmarks[index]);
});


// LISTEN: starts server on stand-alone mode 
app.listen( 8080, () => {
    console.log( "Server running on port 8080" );
});

/*
 BASE URL: http://localhost:8080/
 GET all: http://localhost:8080/bookmarks
 GET by title: http://localhost:8080/bookmark?title=Coconut Banana Crunch Muffins
 POST: http://localhost:8080/bookmarks  
      {
        "title": "Vegan Tacos",
        "description": "Vegan Tofu taco 'meat' ",
        "url": "https://www.noracooks.com/vegan-tacos/",
        "rating": 5
      }    
 PATCH: http://localhost:8080/bookmark/:id
     {
        "id": "8460ed31-19b5-43e6-b66f-20293b18e498",
        "title": "Vegan NY Cheesecake",
        "description": "NY Style Strawberry Cheescake",
        "url": "https://biancazapatka.com/en/new-york-cheesecake-recipe-vegan/",
        "rating": 5
    }
 DELETE: http://localhost:8080/bookmark/:id
*/