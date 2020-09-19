import express from "express"; 

const app = express(); 

app.get('/message', (req, res, next) => {   
   res.send({ message: 'Hello world'})
})

app.listen(process.env.PORT || 1337, () => {console.log("server started");})