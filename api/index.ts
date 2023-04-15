import express from "express"

const app = express();

app.use(express.static('dist/public'));
console.log();

const dirname = __dirname.split("\\").slice(0, -1).join("\\")

app.get("/", (req, res) => {
    res.sendFile(dirname + "index.html");
    }
);


app.listen(3000, () => {console.log("Server is running on port 3000")});