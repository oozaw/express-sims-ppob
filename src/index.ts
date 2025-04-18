import app from "./configs/app.config";

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
   if (err) {
      console.error("Error starting server:", err);
      process.exit(1);
   }

   console.log(`Server is running on port ${port}`);
});
