import { Router } from "express";
import { requireUser } from "./middleware/requireUser.mjs";
import { createPool } from "../db/db.mjs";

const router = Router();
const pool = createPool();

router.get("/collections", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM collection");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/collections", requireUser(["Admin", "Seller"]), async (req, res) => {
  const { name, price } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO collection (name, price) VALUES ($1, $2) RETURNING *",
      [name, price]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/collections/:collectionId", async (req, res) => {
  const collectionId = req.params.collectionId;

  try {
    const collection = await pool.query(
      "SELECT * FROM collection WHERE id = $1",
      [collectionId]
    );

    if (collection.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Get associated books for the collection
    const books = await pool.query(
      "SELECT b.* FROM book b WHERE b.collectionid = $1",
      [collectionId]
    );

    const collectionWithBooks = {
      ...collection.rows[0],
      books: books.rows,
    };

    res.json(collectionWithBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/collections/:id", requireUser(["Admin", "Seller"]), async (req, res) => {
  const collectionId = req.params.id;
  const { name, price } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE collection SET name = $1, price = $2 WHERE id = $3 RETURNING *",
      [name, price, collectionId]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Collection not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/collections/:id", requireUser(["Admin", "Seller"]), async (req, res) => {
  const collectionId = req.params.id;
  try {
    const { rows } = await pool.query(
      "DELETE FROM collection WHERE id = $1 RETURNING *",
      [collectionId]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Collection not found" });
    } else {
      const books = await pool.query(
        "DELETE FROM book WHERE collectionid = $1",
        [collectionId]
      );
      res.json({ message: "Collection deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/collections/:id/books", async (req, res) => {
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

router.post("/collections/:id/books", requireUser(["Admin", "Seller"]), async (req, res) => {
  const collectionId = req.params.id;
  const { name, price, description } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO book (name, price, description, collectionid) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, price, description, collectionId]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/collections/:id/books/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  const collectionId = req.params.id;

  try {
    const book = await pool.query(
      "SELECT * FROM book WHERE id = $1 AND collectionid = $2",
      [bookId, collectionId]
    );

    if (book.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/collections/:id/books/:bookId", requireUser(["Admin", "Seller"]), async (req, res) => {
  const bookId = req.params.bookId;
  const collectionId = req.params.id;
  const { name, price, description } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE book SET name = $1, price = $2, description = $3 WHERE id = $5 AND collectionid = $4 RETURNING *",
      [name, price, description, collectionId, bookId]
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

router.delete("/collections/:id/books/:bookId", requireUser(["Admin", "Seller"]), async (req, res) => {
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

router.get("/orders", requireUser(["Admin", "Seller", "User"]), async (req, res) => {
  try {
    console.log(req.user);
    const { rows } = await pool.query('SELECT * FROM "order"');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/orders", requireUser(["Admin", "User"]), async (req, res) => {
  const { date, totalCost } = req.body;
  const userId = req.user.id
  try {
    const { rows } = await pool.query(
      'INSERT INTO "order" (userId, date, totalCost) VALUES ($1, $2, $3) RETURNING *',
      [userId, date, totalCost]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:orderId", requireUser(["Admin", "User"]), async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await pool.query('SELECT * FROM "order" WHERE id = $1', [
      orderId,
    ]);

    if (order.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Get associated books for the order
    //const books = await pool.query('SELECT b.* FROM book b INNER JOIN order__book ob ON b.id = ob.bookId WHERE ob.orderId = $1', [orderId]);

    // Get associated collections for the order
    const collections = await pool.query(
      "SELECT c.* FROM collection c INNER JOIN order__collection oc ON c.id = oc.collectionId WHERE oc.orderId = $1",
      [orderId]
    );

    const orderWithDetails = {
      ...order.rows[0],
      //books: books.rows,
      collections: collections.rows,
    };

    res.json(orderWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/orders/:id", requireUser(["Admin"]), async (req, res) => {
  const orderId = req.params.id;
  const { userId, date, totalCost } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE "order" SET date = $1, totalCost = $2 WHERE id = $3 RETURNING *',
      [date, totalCost, orderId]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/orders/:id", requireUser(["Admin"]), async (req, res) => {
  const orderId = req.params.id;
  try {
    const { rows } = await pool.query(
      'DELETE FROM "order" WHERE id = $1 RETURNING *',
      [orderId]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.json({ message: "Order deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/orders/:orderId/collections/:collectionId", requireUser(["Admin", "User"]), async (req, res) => {
  const orderId = req.params.orderId;
  const collectionId = req.params.collectionId;

  try {
    const orderExists = await pool.query(
      'SELECT 1 FROM "order" WHERE id = $1',
      [orderId]
    );
    const collectionExists = await pool.query(
      "SELECT 1 FROM collection WHERE id = $1",
      [collectionId]
    );

    if (orderExists.rows.length === 0 || collectionExists.rows.length === 0) {
      return res.status(404).json({ error: "Order or collection not found" });
    }

    // Check if the collection is already in the order
    const isCollectionInOrder = await pool.query(
      "SELECT 1 FROM order__collection WHERE collectionId = $1 AND orderId = $2",
      [collectionId, orderId]
    );

    if (isCollectionInOrder.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Collection is already in the order" });
    }

    // Add the collection to the order
    const result = await pool.query(
      "INSERT INTO order__collection (collectionId, orderId) VALUES ($1, $2) RETURNING *",
      [collectionId, orderId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove a collection from an order
router.delete(
  "/orders/:orderId/collections/:collectionId",
  requireUser(["Admin", "User"]),
  async (req, res) => {
    const orderId = req.params.orderId;
    const collectionId = req.params.collectionId;

    try {
      // Check if the order and collection exist
      const orderExists = await pool.query(
        'SELECT 1 FROM "order" WHERE id = $1',
        [orderId]
      );
      const collectionExists = await pool.query(
        "SELECT 1 FROM collection WHERE id = $1",
        [collectionId]
      );

      if (orderExists.rows.length === 0 || collectionExists.rows.length === 0) {
        return res.status(404).json({ error: "Order or collection not found" });
      }

      // Check if the collection is in the order
      const isCollectionInOrder = await pool.query(
        "SELECT 1 FROM order__collection WHERE collectionId = $1 AND orderId = $2",
        [collectionId, orderId]
      );

      if (isCollectionInOrder.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Collection is not in the order" });
      }

      // Remove the collection from the order
      await pool.query(
        "DELETE FROM order__collection WHERE collectionId = $1 AND orderId = $2",
        [collectionId, orderId]
      );
      res.json({ message: "Collection removed from the order" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
export default router;
