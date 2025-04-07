import bodyParser from 'body-parser';
import express from 'express';
import methodOverride from 'method-override';

const app = express();
const port = 3000;

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

let posts = [];

app.get('/', (req, res) => {
    res.render('index.ejs', { posts });
});

app.post('/create-post', (req, res) => {
    const { title, content, author, image } = req.body;
    const date = new Date().toLocaleDateString();

    posts.push({id: Date.now(), title, content, author, image, date });
    res.redirect('/');
});

app.get('/create-post', (req, res) => {
    res.render('new.ejs');
})

app.post('/delete/:id', (req, res) => {
    posts = posts.filter(post => post.id != req.params.id);
    res.redirect('/');
})

app.get('/edit/:id', (req, res) => {
    const postId = req.params.id;
    
    const post = posts.find(p => p.id == postId);
  
    if (post) {
      res.render('edit.ejs', { post });
    } else {
      res.status(404).send('Post not found');
    }
  });

  app.post('/edit/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content, author, image } = req.body;
    const date = new Date().toLocaleDateString();
  
    const post = posts.find(p => p.id == postId);

    if (post) {
        post.title = title;   
        post.content = content; 
        post.author = author;   
        post.image = image;
        post.date = date;
    
        res.redirect('/');
      } else {
        res.status(404).send('Post not found');
      }
    });

app.listen(port, () => {
    console.log(`server running on port ${3000}` );
})