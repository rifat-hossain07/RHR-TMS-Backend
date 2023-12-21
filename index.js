const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// const uri = `mongodb+srv://:@cluster0.1knemol.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsplul7.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("RHR-TmsDB");
    const taskCollection = database.collection("TasksList");

    // to load all tasks
    app.get("/tasks/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const cursor = taskCollection.find(filter);
      const result = await cursor.toArray();
      res.send(result);
    });

    // to load all data
    app.post("/addTask", async (req, res) => {
      const task = req.body;
      //   console.log(task);
      const result = await taskCollection.insertOne(task);
      //   const cursor = taskCollection.find();
      //   const result = await cursor.toArray();
      res.send(result);
    });
    // change the status of tasks
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    // Update Task
    app.put("/tasks/update/:id", async (req, res) => {
      const id = req.params.id;
      const title = req.body.title;
      const description = req.body.description;
      const deadline = req.body.deadline;
      const priority = req.body.priority;
      const status = req.body.status;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: title,
          description: description,
          status: status,
          deadline: deadline,
          priority: priority,
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    // delete the tasks
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(filter);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("RHR-TMS is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
