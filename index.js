import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
    { id: 1, title: "Buy milk" },
    { id: 2, title: "Finish homework" },
];
let nextId = 3;

app.get("/", (req, res) => {
    res.render("index", {
        listTitle: "Today",
        listItems: items,
    });
});

app.post("/add", (req, res) => {
    const item = req.body.newItem;
    if (item && item.trim() !== "") {
        items.push({ id: nextId++, title: item.trim() });
    }
    res.redirect("/");
});

app.post("/edit", (req, res) => {
    const id = parseInt(req.body.updatedItemId);
    const newTitle = req.body.updatedItemTitle;
    const item = items.find(i => i.id === id);
    if (item && newTitle && newTitle.trim() !== "") {
        item.title = newTitle.trim();
    }
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const id = parseInt(req.body.deleteItemId);
    items = items.filter(i => i.id !== id);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
