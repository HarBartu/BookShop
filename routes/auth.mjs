import { Router } from "express";
import { createPool } from "../db/db.mjs";
import { signJWT } from "../utils/jwt.utils.mjs";
import bcrypt from "bcrypt";

const router = Router();
const pool = createPool();

router.post("/register", async (req, res) => {
  const { name, role, email, password } = req.body;

  try {
    const userExists = await pool.query(
      'SELECT 1 FROM "user" WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      'INSERT INTO "user" (name, role, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role, email, hashedPassword]
    );
    res.status(201).json("Success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM "user" WHERE email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userInfo = user.rows[0];

    const accessToken = signJWT(
      { email: userInfo.email, role: userInfo.role },
      "30s"
    );

    const refreshToken = signJWT(
      { email: userInfo.email, role: userInfo.role },
      "1y"
    );


    res.cookie("accessToken", accessToken, {
      maxAge: 300000,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 3.154e10,
      httpOnly: true,
    });

    return res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/logout", async (req, res) => {
  try {
    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    return res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
