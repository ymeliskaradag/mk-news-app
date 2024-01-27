const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const multer = require('multer');

  
const dbConfig = {
  user: 'vkttpfeh',
  host: 'manny.db.elephantsql.com',
  password: 'zjJt4UQKf3JZhLm7FCnUq51qHvw67zSW',
  port: 5432,
  database: 'vkttpfeh', 
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '/img/');
      fs.mkdirSync(uploadPath, { recursive: true }); 
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

const pool = new Pool(dbConfig);
const app = express();
const port = 3000; 
const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} Request to ${req.url}`);
    console.log('Body:', req.body);
    next();
  });

pool.connect()
  .then(client => {
    console.log('Veritabanına başarıyla bağlandı');

    const createTableText = `
        CREATE TABLE IF NOT EXISTS userinfo (
        userid serial PRIMARY KEY,
        username varchar(30),
        usersurname varchar(30),
        userphone varchar(11),
        useremail varchar(30),
        password varchar(255),
        planguage varchar(5),
        pimage bytea,
        plocation varchar(5)
        )`;
    
    client.query(createTableText)
        .then(() => {
        console.log('Tablo başarıyla oluşturuldu veya zaten mevcut');
        client.release();
        })
        .catch(err => {
        console.error('Tablo oluşturulurken hata oluştu', err.stack);
        client.release();
        });
  })
  .catch(err => {
    console.error('Veritabanına bağlanırken hata oluştu', err.stack);
  });

  
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      
      const hashedPassword = await bcrypt.hash(password, 10);
  
      
      const result = await pool.query('INSERT INTO userinfo (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
      res.status(201).send(`Kullanıcı oluşturuldu: ${result.rows[0].username}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Sunucuda bir hata oluştu.');
    }
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM userinfo WHERE username = $1', [username]);
      const user = result.rows[0];
  
      if (user && await bcrypt.compare(password, user.password)) {
        res.send('Giriş başarılı.');
      } else {
        res.status(400).send('Kullanıcı adı veya şifre hatalı.');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Sunucuda bir hata oluştu.');
    }
  });
  
  app.get('/profile', async (req, res) => {
    const username = req.query.username; 
  
    try {
      const result = await pool.query('SELECT * FROM userinfo WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Kullanıcı bulunamadı.');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Sunucuda bir hata oluştu.');
    }
  });

  
  app.get('/location', async (req, res) => {
    const username = req.query.username; 
  
    try {
      const result = await pool.query('SELECT plocation FROM userinfo WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Kullanıcı bulunamadı.');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Sunucuda bir hata oluştu.');
    }
  });
  
  app.get('/language', async (req, res) => {
    const username = req.query.username; 
  
    try {
      const result = await pool.query('SELECT planguage FROM userinfo WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        console.log(result);
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Kullanıcı bulunamadı.');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Sunucuda bir hata oluştu.');
    }
  });
  

  
  app.post('/updateProfile', async (req, res) => {
    const { username, usersurname, userphone, useremail, password, planguage, plocation, updatePassword } = req.body;
  
    try {
        var hashedPassword='',updateQuery='';
        if(updatePassword){
            hashedPassword = await bcrypt.hash(password, 10);
            updateQuery = `
              UPDATE userinfo
              SET usersurname = $1, userphone = $2, useremail = $3, password = $4, planguage = $5, plocation = $6
              WHERE username = $7`;
              await pool.query(updateQuery, [usersurname, userphone, useremail, hashedPassword, planguage, plocation, username]);
        }
        else{
            updateQuery = `
        UPDATE userinfo
        SET usersurname = $1, userphone = $2, useremail = $3, planguage = $4, plocation = $5
        WHERE username = $6`;
        await pool.query(updateQuery, [usersurname, userphone, useremail, planguage, plocation, username]);
        }
      res.send('Kullanıcı bilgileri başarıyla güncellendi.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Sunucuda bir hata oluştu.');
    }
  });

  
  
  app.get('/images/:imagename', (req, res) => {
    const imagename = req.params.imagename;
    const imagePath = path.join(__dirname, 'img', imagename);
    
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send('Image not found');
    }
  });

  app.post('/uploadImage', async (req, res) => {
    const { image, username } = req.body;
    if (!image || !username) {
      return res.status(400).send('Image or username not provided.');
    }
    const buffer = Buffer.from(image.split(",")[1], 'base64');
    try {
      const updateQuery = 'UPDATE userinfo SET pimage = $1 WHERE username = $2';
      await pool.query(updateQuery, [buffer, username]);
  
      res.status(200).send({ message: 'Image uploaded successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error during image upload.');
    }
  });

  app.listen(port, () => {
    console.log(`Sunucu ${port} numaralı portta çalışıyor.`);
  });