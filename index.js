const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');


// Configure PostgreSQL database connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "saitynai",
  password: "root",
  port: 5432,
});

// Middleware for parsing JSON data
app.use(bodyParser.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *
 *     Collection:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         totalCost:
 *           type: number
 */


const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
  const { name, role, email, password } = req.body;

  try {
    const userExists = await pool.query('SELECT 1 FROM "user" WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query('INSERT INTO "user" (name, role, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [name, role, email, hashedPassword]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const jwt = require('jsonwebtoken')

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.rows[0].id }, 'Saitynai', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all collections
/**
 * @swagger
 * /collections:
 *   get:
 *     summary: Get a list of collections
 *     description: Retrieve a list of collections.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collection'
 */
app.get('/collections', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM collection');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/collections', async (req, res) => {
    const { name, price } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO collection (name, price) VALUES ($1, $2) RETURNING *', [name, price]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/collections/:collectionId', async (req, res) => {
    const collectionId = req.params.collectionId;
  
    try {
      const collection = await pool.query('SELECT * FROM collection WHERE id = $1', [collectionId]);
  
      if (collection.rows.length === 0) {
        return res.status(404).json({ error: 'Collection not found' });
      }
  
      // Get associated books for the collection
      const books = await pool.query('SELECT b.* FROM book b WHERE b.collectionid = $1', [collectionId]);
  
      const collectionWithBooks = {
        ...collection.rows[0],
        books: books.rows,
      };
  
      res.json(collectionWithBooks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.put('/collections/:id', async (req, res) => {
    const collectionId = req.params.id;
    const { name, price } = req.body;
    try {
      const { rows } = await pool.query('UPDATE collection SET name = $1, price = $2 WHERE id = $3 RETURNING *', [name, price, collectionId]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Collection not found' });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.delete('/collections/:id', async (req, res) => {
    const collectionId = req.params.id;
    try {
      const { rows } = await pool.query('DELETE FROM collection WHERE id = $1 RETURNING *', [collectionId]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Collection not found' });
      } else {
        const books = await pool.query('DELETE FROM book WHERE collectionid = $1', [collectionId]);
        res.json({ message: 'Collection deleted' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/collections/:id/books', async (req, res) => {
    const collectionId = req.params.id;
    try {
      const { rows } = await pool.query(
        "SELECT * FROM book WHERE collectionid = $1",
        [collectionId]
      );
      res.status(201).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post('/collections/:id/books', async (req, res) => {
    const collectionId = req.params.id;
    const { name, price } = req.body;
    try {
      const { rows } = await pool.query(
        "INSERT INTO book (name, price, collectionid) VALUES ($1, $2, $3) RETURNING *",
        [name, price, collectionId]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get('/collections/:id/books/:bookId', async (req, res) => {
    const bookId = req.params.bookId;
    const collectionId = req.params.id;
  
    try {
      const book = await pool.query('SELECT * FROM book WHERE id = $1 AND collectionid = $2', [bookId, collectionId]);
  
      if (book.rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      res.json(book.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.put("/collections/:id/books/:bookId", async (req, res) => {
    const bookId = req.params.bookId;
    const collectionId = req.params.id;
    const { name, price } = req.body;
    try {
      const { rows } = await pool.query(
        "UPDATE book SET name = $1, price = $2 WHERE id = $4 AND collectionid = $3 RETURNING *",
        [name, price, collectionId, bookId]
      );
      if (rows.length === 0) {
        res.status(404).json({ error: "Book not found" });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.delete("/collections/:id/books/:bookId", async (req, res) => {
    const bookId = req.params.bookId;
    const collectionId = req.params.id;
    try {
      const { rows } = await pool.query(
        "DELETE FROM book WHERE id = $1 AND collectionid = $2 RETURNING *",
        [bookId, collectionId]
      );
      if (rows.length === 0) {
        res.status(404).json({ error: "Book not found" });
      } else {
        res.json({ message: "Book deleted" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get a list of orders
 *     description: Retrieve a list of orders.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
app.get('/orders', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM "order"');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/orders', async (req, res) => {
    const { userId, date, totalCost } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO "order" (userid, date, totalCost) VALUES ($1, $2, $3) RETURNING *', [userId, date, totalCost]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/orders/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
  
    try {
      const order = await pool.query('SELECT * FROM "order" WHERE id = $1', [orderId]);
      
      if (order.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Get associated books for the order
      //const books = await pool.query('SELECT b.* FROM book b INNER JOIN order__book ob ON b.id = ob.bookId WHERE ob.orderId = $1', [orderId]);
  
      // Get associated collections for the order
      const collections = await pool.query('SELECT c.* FROM collection c INNER JOIN order__collection oc ON c.id = oc.collectionId WHERE oc.orderId = $1', [orderId]);
  
      const orderWithDetails = {
        ...order.rows[0],
        //books: books.rows,
        collections: collections.rows,
      };
  
      res.json(orderWithDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.put('/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    const { userId, date, totalCost } = req.body;
    try {
      const { rows } = await pool.query('UPDATE "order" SET userId = $1, date = $2, totalCost = $3 WHERE id = $4 RETURNING *', [userId, date, totalCost, orderId]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.delete('/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
      const { rows } = await pool.query('DELETE FROM "order" WHERE id = $1 RETURNING *', [orderId]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.json({ message: 'Order deleted' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.post('/orders/:orderId/collections/:collectionId', async (req, res) => {
    const orderId = req.params.orderId;
    const collectionId = req.params.collectionId;
  
    try {
      const orderExists = await pool.query('SELECT 1 FROM "order" WHERE id = $1', [orderId]);
      const collectionExists = await pool.query('SELECT 1 FROM collection WHERE id = $1', [collectionId]);
  
      if (orderExists.rows.length === 0 || collectionExists.rows.length === 0) {
        return res.status(404).json({ error: 'Order or collection not found' });
      }
  
      // Check if the collection is already in the order
      const isCollectionInOrder = await pool.query('SELECT 1 FROM order__collection WHERE collectionId = $1 AND orderId = $2', [collectionId, orderId]);
  
      if (isCollectionInOrder.rows.length > 0) {
        return res.status(409).json({ error: 'Collection is already in the order' });
      }
  
      // Add the collection to the order
      const result = await pool.query('INSERT INTO order__collection (collectionId, orderId) VALUES ($1, $2) RETURNING *', [collectionId, orderId]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Remove a collection from an order
app.delete('/orders/:orderId/collections/:collectionId', async (req, res) => {
    const orderId = req.params.orderId;
    const collectionId = req.params.collectionId;
  
    try {
      // Check if the order and collection exist
      const orderExists = await pool.query('SELECT 1 FROM "order" WHERE id = $1', [orderId]);
      const collectionExists = await pool.query('SELECT 1 FROM collection WHERE id = $1', [collectionId]);
  
      if (orderExists.rows.length === 0 || collectionExists.rows.length === 0) {
        return res.status(404).json({ error: 'Order or collection not found' });
      }
  
      // Check if the collection is in the order
      const isCollectionInOrder = await pool.query('SELECT 1 FROM order__collection WHERE collectionId = $1 AND orderId = $2', [collectionId, orderId]);
  
      if (isCollectionInOrder.rows.length === 0) {
        return res.status(404).json({ error: 'Collection is not in the order' });
      }
  
      // Remove the collection from the order
      await pool.query('DELETE FROM order__collection WHERE collectionId = $1 AND orderId = $2', [collectionId, orderId]);
      res.json({ message: 'Collection removed from the order' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }); 

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
