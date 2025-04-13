import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const apiUrl = `https://thecocktaildb.com/api/json/v2/${apiKey}`;
const cocktailsCache = {};
const drinkCache = {};
const alcholicCache = {};
const nonalcoholicCache = {};
const ordinaryCache = {};
const cocktailCache = {};
const cocktailGlassCache = {};
const champagneFluteCache = {};
const popularCache = {};
const latestCache = {};
const ginCache = {};
const vodkaCache = {};
const rumCache = {};
const tequilaCache = {};
const scotchCache = {};
const drinkOfTheDayCache = {};
const oneHour = 60 * 60 * 1000; //In Milliseconds
const cleanupInterval = 15 * 60 * 1000 //Every 15 minutes

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
});

const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); //Add leading 0 for day
    const month = String(today.getMonth() + 1).padStart(2, '0') //Add leading 0 for month
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
};

function cleanCache(cache) {
    for (const key in cache) {
        if (cache[key].timestamp && Date.now() - cache[key].timestamp > oneHour) {
            delete cache[key];
            //console.log(`Deleted stale cache entry: ${key}`);
        }
    }
}

//Cleanup all caches periodically
setInterval(() => {
    cleanCache(cocktailsCache);
    cleanCache(drinkCache);
    cleanCache(alcholicCache);
    cleanCache(nonalcoholicCache);
    cleanCache(ordinaryCache);
    cleanCache(cocktailCache);
    cleanCache(cocktailGlassCache);
    cleanCache(champagneFluteCache);
    cleanCache(popularCache);
    cleanCache(latestCache);
    cleanCache(ginCache);
    cleanCache(vodkaCache);
    cleanCache(rumCache);
    cleanCache(tequilaCache);
    cleanCache(scotchCache);
    //console.log("Cache cleanup complete.");
}, cleanupInterval);

app.get("/", async (req, res) => {
    const cacheEntry = cocktailsCache["A"];
    try {
        //Check if data is cached and is fresh
        if (cacheEntry && cacheEntry.timestamp && Date.now() - cacheEntry.timestamp < oneHour) {
            //console.log(`Using cached data for A`);
            res.render("index.ejs", { cocktails: cacheEntry.data });
        } else {
            const data = await fetchCocktailsByName("A"); //Fetch from API
            cocktailsCache["A"] = {
                data: data,
                timestamp: Date.now()
            }
            res.render("index.ejs", { cocktails: data });
        }
    } catch(error) {
        console.error("Unable to Fetch Cocktails.", error.message);
        res.status(500).send("Server Error!");
    }
});

app.get("/cocktails/:letter", async (req, res) => {
    const letter = req.params.letter;
    const cacheEntry = cocktailsCache[letter];
    try {
        //Check if data is cached and is fresh
        if (cacheEntry && cacheEntry.timestamp && Date.now() - cacheEntry.timestamp < oneHour) {
            //console.log(`Using cached data for ${letter}`);
            res.json(cacheEntry.data); //Send JSON Response to cient
        } else {
            const data = await fetchCocktailsByName(letter); //Fetch from API
            cocktailsCache[letter] = {
                data: data,
                timestamp: Date.now()
            }
            res.json(data); //Send JSON Response to client
        }
    } catch(error) {
        console.error("Error fetching cocktails.", error.message);
        res.status(500).json({ error: "Unable to fetch cocktails!", details: error.message });
    }
});

async function fetchCocktailsByName(letter) {
    try {
        const response = await axios.get(apiUrl + `/search.php?f=${letter.toLowerCase()}`);
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        return data;
    } catch(error) {
        console.error("Unable to Fetch Cocktails.", error.message);
        throw new Error("Error fetching cocktails from the API");
    }
}

app.get("/drink/:id", async (req, res) => {
    const drinkId = req.params.id;
    const cacheEntry = drinkCache[drinkId];
    try {
        //Check whether data for this drink is already cached and is fresh
        if (cacheEntry && cacheEntry.timestamp && Date.now() - cacheEntry.timestamp < oneHour) {
            //console.log(`Using cached data for ${drinkId}`);
            return res.json(cacheEntry.data);
        }
        //Else make the API call
        const response = await axios.get(apiUrl + `/lookup.php?i=${drinkId}`);
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        //Store the fetched data in cache
        drinkCache[drinkId] = {
            data: data,
            timestamp: Date.now()
        }
        res.json(data);
    } catch (error) {
        console.error("Error fethching drink details.", error.message);
        res.status(500).json({ error: "Unable to fetch drink details!", details: error.message });
    }
});

app.get("/alcoholic", async (req, res) => {
    try {
        //check if data is cached and is fresh
        if (alcholicCache.data && alcholicCache.timestamp && Date.now() - alcholicCache.timestamp < oneHour) {
            //console.log("Using cached data for Alcoholic Drinks");
            return res.json(alcholicCache.data);
        }
        const response = await axios.get(apiUrl + `/filter.php`, {
            params: {
                a: 'Alcoholic'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        alcholicCache.data = data; //Store the fetched data in cache
        alcholicCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching Alcholic drinks.", error.message);
        res.status(500).json({ error: "Unable to fetch alcoholic drinks!", details: error.message});
    }
});

app.get("/nonalcoholic", async (req, res) => {
    try {
        if (nonalcoholicCache.data && nonalcoholicCache.timestamp && Date.now() - nonalcoholicCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for Non-Alcoholic Drinks");
            return res.json(nonalcoholicCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                a: 'Non_Alcoholic'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        nonalcoholicCache.data = data; //Store the fetched data in cache
        nonalcoholicCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching Non-Alcoholic drinks", error.message);
        res.status(500).json({ error: "Unable to fetch non-alcoholic drinks!", details: error.message });
    }
});

app.get("/ordinary", async (req, res) => {
    try {
        if (ordinaryCache.data && ordinaryCache.timestamp && Date.now() - ordinaryCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for Ordinary Drinks");
            return res.json(ordinaryCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                c: 'Ordinary_Drink'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        ordinaryCache.data = data; //Store the fetched data in cache
        ordinaryCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching ordinary drinks", error.message);
        res.status(500).json({ error: "Unable to fetch ordinary drinks!", details: error.message });
    }
});

app.get("/cocktaildrinks", async (req, res) => {
    try {
        if (cocktailCache.data && cocktailCache.timestamp && Date.now() - cocktailCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for Cocktail Drinks");
            return res.json(cocktailCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                c: 'Cocktail'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        cocktailCache.data = data; //Store the fetched data in cache
        cocktailCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching cocktail drinks", error.message);
        res.status(500).json({ error: "Unable to fetch cocktail drinks!", details: error.message });
    }
});

app.get("/cocktailglassdrinks", async (req, res) => {
    try {
        if (cocktailGlassCache.data && cocktailGlassCache.timestamp && Date.now() - cocktailGlassCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for drinks served in Cocktail Glass");
            return res.json(cocktailGlassCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                g: 'Cocktail_glass'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        cocktailGlassCache.data = data; //Store the fetched data in cache
        cocktailGlassCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching drinks served in cocktail glass", error.message);
        res.status(500).json({ error: "Unable to fetch drinks served in cocktail glass!", details: error.message });
    }
});

app.get("/champagneflutedrinks", async (req, res) => {
    try {
        if (champagneFluteCache.data && champagneFluteCache.timestamp && Date.now() - champagneFluteCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for drinks served in Champagne Flute");
            return res.json(champagneFluteCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                g: 'Champagne_flute'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        champagneFluteCache.data = data; //Store the fetched data in cache
        champagneFluteCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching drinks served in champagne flute", error.message);
        res.status(500).json({ error: "Unable to fetch drinks served in champagne flute!", details: error.message });
    }
});

app.get("/populardrinks", async (req, res) => {
    try {
        if (popularCache.data && popularCache.timestamp && Date.now() - popularCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for popular drinks");
            return res.json(popularCache.data);
        }
        const response = await axios.get(apiUrl + "/popular.php");
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        popularCache.data = data; //Store the fetched data in cache
        popularCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching popular drinks", error.message);
        res.status(500).json({ error: "Unable to fetch popular drinks", details: error.message });
    }
});

app.get("/latestdrinks", async (req, res) => {
    try {
        if (latestCache.data && latestCache.timestamp && Date.now() - latestCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for new drinks");
            return res.json(latestCache.data);
        }
        const response = await axios.get(apiUrl + "/latest.php");
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        latestCache.data = data; //Store the fetched data in cache
        latestCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching new drinks", error.message);
        res.status(500).json({ error: "Unable to fetch new drinks", details: error.message });
    }
});

app.get("/ginbaseddrinks", async (req, res) => {
    try {
        if (ginCache.data && ginCache.timestamp && Date.now() - ginCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for gin based drinks");
            return res.json(ginCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                i: 'Gin'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        ginCache.data = data; //Store the fetched data in cache
        ginCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching gin based drinks", error.message);
        res.status(500).json({ error: "Unable to fetch gin based drinks", details: error.message });
    }
});

app.get("/vodkabaseddrinks", async (req, res) => {
    try {
        if (vodkaCache.data && vodkaCache.timestamp && Date.now() - vodkaCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for vodka based drinks");
            return res.json(vodkaCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                i: 'Vodka'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        vodkaCache.data = data; //Store the fetched data in cache
        vodkaCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching vodka based drinks", error.message);
        res.status(500).json({ error: "Unable to fetch vodka based drinks", details: error.message });
    }
});

app.get("/rumbaseddrinks", async (req, res) => {
    try {
        if (rumCache.data && rumCache.timestamp && Date.now() - rumCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for rum based drinks");
            return res.json(rumCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                i: 'Rum'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        rumCache.data = data; //Store the fetched data in cache
        rumCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching rum based drinks", error.message);
        res.status(500).json({ error: "Unable to fetch rum based drinks", details: error.message });
    }
});

app.get("/tequilabaseddrinks", async (req, res) => {
    try {
        if (tequilaCache.data && tequilaCache.timestamp && Date.now() - tequilaCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for tequila based drinks");
            return res.json(tequilaCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                i: 'Tequila'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        tequilaCache.data = data; //Store the fetched data in cache
        tequilaCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching tequila based drinks", error.message);
        res.status(500).json({ error: "Unable to fetch tequila based drinks", details: error.message });
    }
});

app.get("/scotchbaseddrinks", async (req, res) => {
    try {
        if (scotchCache.data && scotchCache.timestamp && Date.now() - scotchCache.timestamp < oneHour) { //check if the data is cached and is fresh
            //console.log("Using cached data for scotch based drinks");
            return res.json(scotchCache.data);
        }
        const response = await axios.get(apiUrl + "/filter.php", {
            params: {
                i: 'Scotch'
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        //console.log("Fetched Data:", data);
        scotchCache.data = data; //Store the fetched data in cache
        scotchCache.timestamp = Date.now();
        res.json(data);
    } catch (error) {
        console.error("Error fetching scotch based drinks", error.message);
        res.status(500).json({ error: "Unable to fetch scotch based drinks", details: error.message });
    }
});

app.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        const response = await axios.get(apiUrl + "/search.php", {
            params: {
                s: query
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error("Error fetching drinks", error.message);
        res.status(500).json({ error: "Unable to fetch drinks", details: error.message });
    }
});

app.get("/specialDrink", async (req, res) => {
    const currentDate = getCurrentDate();
    if (drinkOfTheDayCache[currentDate]) {
        return res.json(drinkOfTheDayCache[currentDate]);
    }

    try {
        const response = await axios.get(apiUrl + "/random.php");
        if (response.status !== 200) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = response.data;
        drinkOfTheDayCache[currentDate] = data;
        res.json(data);
    } catch (error) {
        console.error("Error fetching drink of the day", error.message);
        res.status(500).json({ error: "Unable to fetch drink of the day", details: error.message });
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});