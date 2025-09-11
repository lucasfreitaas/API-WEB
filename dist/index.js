import express from "express";
const app = express();
app.get("/", (req, res) => {
    res.send("AAAAAAAAAAAAAAAAAAAA");
});
app.listen(8080, () => {
    console.log("Servidor iniciado: http://localhost:8080");
});
//# sourceMappingURL=index.js.map