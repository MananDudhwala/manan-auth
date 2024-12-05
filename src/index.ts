import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import bodyParser, { BodyParser } from "body-parser";
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.use(cors<Request>({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PATCH'],
    credentials: false,
}))

app.get("/", (req: Request, res: Response) => {
    res.send("My server");
});

app.post("/signup/", async (request: Request, response: Response) => {
    console.log(request.body)
    const { firstname, lastname, email, password } = request.body;

    const payload = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
    }




    response.status(201)
    response.send({
        message: "received"
    })
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});