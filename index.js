const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const logger = require("morgan");
const dotenv = require("dotenv").config();

app.use(logger("dev"));
app.use(cors());

let API_KEY = process.env.YELP_API_KEY;

let yelpREST = axios.create({
    baseURL: "https://api.yelp.com/v3/",
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        origin: "localhost",
        "Content-type": "application/json",
    },
});

app.get("/", async (req, res) => {
    const { term, location, sort_by } = req.query;
    try {
        await yelpREST("/businesses/search", {
            params: {
                location: location,
                term: term,
                sort_by: sort_by,
                limit: 20,
            },
        }).then(({ data }) => {
            res.send(data);
        });
    } catch (err) {
        res.status(400).json({
            message: "unable to retrieve businesses",
            err,
        });
    }
});
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
