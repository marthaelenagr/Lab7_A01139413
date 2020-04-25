const API_KEY = "2abbf7c3-245b-404f-9473-ade729ed4653";

function keyHandler(req, res, next){
  let token = req.headers.authorization;
  let apiKey = req.headers['book-api-key'];
  let queryApiKey = req.query.API_KEY;
  
  if (!token && !apiKey && !queryApiKey){
    res.statusMessage = "Please provide the autorization token";
    return res.status(401).end();
  }
  
  if(token){
    if(token !== `Bearer ${API_KEY}`){
      res.statusMessage = "Invalid key";
      return res.status(401).end();
    }
  }
  
  if(apiKey){
    if(apiKey !== API_KEY){
      res.statusMessage = "Invalid key";
      return res.status(401).end();
    }
  }
  
  if (queryApiKey){
    if (queryApiKey !== API_KEY){
      res.statusMessage = "Invalid key";
      return res.status(401).end();
    }
  }
  next();
};

module.exports = keyHandler;