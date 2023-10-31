const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");
    } catch (error) {
      console.error('Error connecting to DB: ', error);
      process.exit(1);
    }
}
connectToDatabase();

router.get('/', (req, res) => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    const locals = {
        title: 'Home',
        description: "Bookings by JDev is a booking example of what your booking/appointment page would be looking like.",
        dir: "booking",
        status: "connected",
        currentTime: currentTime,
        currentDate: currentDate
    }
    res.render('index', locals);
});

router.get('/search', async (req, res) => {
    try {
        await client.connect();

        const db = client.db("bookings-db");
        const collection = db.collection("bookings");

        const results = await collection.find({
            $or: [
                { name: req.query.searchQuery },
                { email: req.query.searchQuery },
                { bookingID: req.query.searchQuery }
            ]
        }).toArray();

        const locals = {
            title: 'Search',
            description: "Bookings by JDev is a booking example of what your booking/appointment page would be looking like.",
            dir: "search",
            status: "connected",
            results: results,
            searchQ: req.query.searchQuery
        };

        res.render('search', locals);
    } catch (error) {
        console.error('Error searching DB: ', error);
        res.status(500).send('Error searching DB');
    } finally {
        await client.close();
    }
});

router.get('/detail-view', async (req, res) => {
    try {
        await client.connect();

        const db = client.db("bookings-db");
        const collection = db.collection("bookings");

        const recordId = req.query.id;

        const detail = await collection.findOne({ bookingID: recordId });

        if (detail) {
            const locals = {
                title: 'Details',
                description: "Bookings by JDev is a booking example of what your booking/appointment page would be looking like.",
                dir: "success",
                status: "connected",
                detail: detail
            };

            res.render('detail-view', locals);
        } else {
            res.status(404).send('Record not found');
        }
    } catch (error) {
        console.error('Error fetching record details: ', error);
        res.status(500).send('Error fetching record details');
    } finally {
        await client.close();
    }
});
router.get('/details', async (req, res) => {
    const locals = {
        title: 'Details',
        description: "Bookings by JDev is a booking example of what your booking/appointment page would be looking like.",
        dir: "detail",
        status: "connected"
    };

    res.render('detail-view', locals);
});

// form submission
router.post('/submit-booking', async (req, res) => {
    try {
        await client.connect();

        const db = client.db("bookings-db");
        const collection = db.collection("bookings");

        const { bookingID, name, email, booking_title, booking_details, time, date } = req.body;

        const result = await collection.insertOne({
            bookingID,
            name,
            email,
            booking_title,
            booking_details,
            time,
            date
        });

        const locals = {
            title: 'Success',
            description: "Bookings by JDev is a booking example of what your booking/appointment page would be looking like.",
            dir: "success",
            status: "connected"
        };

        res.render('success', locals);
    } catch (error) {
        console.error('Error submitting form: ', error);
        
        const locals = {
            title: 'Error',
            description: "Bookings by JDev is a booking example of what your booking/appointment page would be looking like.",
            dir: "error",
            status: "connected",
            error: error
        };
        res.render('error', locals);
    } finally {
        await client.close();
    }
});

module.exports = router;