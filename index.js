import bodyParser from 'body-parser';
import express from 'express';
import methodOverride from 'method-override';
import pg from 'pg';

const app = express();
const port = 3000;

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Blog_posts",
  password: "Meedaah19",
  port: 5432,
});
db.connect();

let posts = [];

async function getPosts() {
    try {
        const result = await db.query('SELECT * FROM posts ORDER BY id ASC');
        posts = result.rows;
        return posts;
    } catch (err) {
        console.log(err);
        //  return [];
    }
}

app.get('/', async(req, res) => {
  const blogs = await getPosts();
  console.log(blogs)
  res.render("index.ejs", {
   posts: blogs,
  });
});

app.post('/create-post', async(req, res) => {
    const { title, content, author, image } = req.body;
    const date = new Date().toISOString().split("T")[0];

    try{
      await db.query('INSERT INTO posts (title, content, author, image, date) VALUES ($1, $2, $3, $4, $5);',
        [title, content, author, image, date]
      );
      res.redirect('/');
    }catch(err){
        console.log(err);
    }
});

app.get('/create-post', (req, res) => {
    res.render('new.ejs');
})

app.post('/delete/:id', (req, res) => {
    // posts = posts.filter(post => post.id != req.params.id);
    try{
        db.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
         res.redirect('/');
    }catch(err){
        console.log(err);
    }
   
})

app.get('/edit/:id', async(req, res) => {
    const postId = req.params.id;
    

    try{
      await db.query('SELECT * FROM posts WHERE id = $1', [postId]);
      res.render('edit.ejs', { post: posts.find(p => p.id == postId) });
    } catch(err){
      const post = posts.find(p => p.id == postId);
        console.log(err);
         res.render('index.ejs');
         res.status(404).send('Post not found');
    }
  });

  app.post('/edit/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content, author, image } = req.body;
    const date = new Date().toISOString().split("T")[0];
    //const post = posts.find(p => p.id == postId);
     
    try{
        db.query('UPDATE posts SET title = $1, content = $2, author = $3, image = $4, date = $5 WHERE id = $6',
        [title, content, author, image, date, postId]);
         res.redirect('/');
    }catch(err){
      console.log(err);
    }
    });

app.listen(port, () => {
    console.log(`server running on port ${3000}` );
})