import express from 'express';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import pool from './db.js';
import client from './redis.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'URL Shortener API is running' });
});


app.get('/urls', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, short_code, original_url, created_at, click_count, last_accessed FROM urls ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching URLs:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});


app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const shortCode = nanoid(7);

  try {
    // Insert into DB
    await pool.query(
      'INSERT INTO urls (short_code, original_url) VALUES ($1, $2)',
      [shortCode, url]
    );

    // Cache in Redis
    await client.set(shortCode, url);

    // Respond with shortened link
    const shortUrl = `${process.env.BASE_URL || 'http://localhost:' + process.env.PORT}/${shortCode}`;
    res.status(201).json({ short: shortUrl });
  } catch (err) {
    console.error('Error creating short URL:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/:short_code', async (req, res) => {
  const { short_code } = req.params;

  try {
    // Try Redis cache
    let url = await client.get(short_code);
    if (url) {
      console.log('⚡ Cache hit:', short_code);

      // Update click count + last accessed in DB asynchronously
      pool.query(
        'UPDATE urls SET click_count = click_count + 1, last_accessed = NOW() WHERE short_code = $1',
        [short_code]
      ).catch(err => console.error('DB update error:', err.message));

      return res.redirect(url);
    }

    // Fallback to DB
    const result = await pool.query(
      'SELECT original_url FROM urls WHERE short_code = $1',
      [short_code]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Short URL not found' });

    url = result.rows[0].original_url;

    // Update click count + last accessed
    await pool.query(
      'UPDATE urls SET click_count = click_count + 1, last_accessed = NOW() WHERE short_code = $1',
      [short_code]
    );

    // Cache the URL
    await client.set(short_code, url);

    res.redirect(url);

  } catch (err) {
    console.error('Redirect error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
