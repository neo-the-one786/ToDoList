import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "todolist",
    password: "Charlesbabbage123@",
    port: 5432
});
db.connect();

app.get("/", async (req, res) => {
    try {
        const result = await db.query("select * from items");
        let items = [];
        items = result.rows;
        res.render("index.ejs", {
            listTitle: "This day",
            listItems: items
        });
    } catch (e) {
        console.log(e);
    }
});

app.post("/add", async (req, res) => {
    const input = req.body.newItem;
    try {
        await db.query("insert into items (title) values ($1);", [input]);
        res.redirect("/");
    } catch (e) {
        console.log(e);
    }
});

app.post("/edit", async (req, res) => {
    const title = req.body.updatedItemTitle;
    const id = req.body.updatedItemID;
    try {
        await db.query("update items set title = ($1) where id = $2", [title, id]);
        res.redirect("/");
    } catch (e) {
        console.log(e);
    }
});

app.post("/delete", async (req, res) => {
    const id = req.body.deleteItemID;
    try {
        await db.query("delete from items where id = $1", [id]);
        res.redirect("/");
    } catch (e) {
        console.log(e);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
