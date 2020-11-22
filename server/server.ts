import app from "./app"; 

app.listen(process.env.PORT || 1337, () => {
  console.log("server started");
})