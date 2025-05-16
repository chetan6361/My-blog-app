import express from "express";
import { title } from "process";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", (req , res) => {
  res.render("home.ejs", { posts: posts });
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post("/new", (req, res ) => {
  const { title, content } = req.body;

  const now = new Date();

  const indianDateTime = now.toLocaleString('en-IN', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const newPost = {
    
    dntime : indianDateTime,
    id: Date.now(),
    title: title,
    content: content
  };

  posts.push(newPost);
  res.redirect('/?submitted=true');

});

app.get('/edit/:id', (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).send('Post not found');
  }

  res.render('edit.ejs', { post: post });
});

app.post('/edit/:id', (req, res) => {
  const postId = Number(req.params.id);
  const { title, content } = req.body;

  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) {
    return res.status(404).send('Post not found');
  }

  posts[postIndex].title = title;
  posts[postIndex].content = content;

  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  const postId = Number(req.params.id);
  posts = posts.filter(p => p.id !== postId);
  res.redirect('/');
});


app.listen(PORT, () =>{
  console.log(`Listening on port ${PORT}`);
});
