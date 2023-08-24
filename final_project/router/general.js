const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

  if (!username && username.length > 1)
    return res.status(400).json({ error: "name is required" });
  if (!password &&  password.length > 1)
    return res.status(400).json({error: "password is required"});

  // check if username is already exist or not
  if (!isValid(username))
   return res.status(400).json({ error: "user is already exist" });

  users.push({username: username,password: password,});
  res.status(200).json({ message: "user registered successfully.", users });
});


function getBooks(){

    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(books)
        },200)})

    return myPromise;
    
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  getBooks().then((ans)=>{
    res.send(JSON.stringify({ ans }, null, 4));
  }).catch(()=>{
      res.status(300).json({message: "there was a problem"})
    })

  
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN

function getBooksbyisbn(isbn){

    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(books[isbn])
        },200)})

    return myPromise;
    
}
public_users.get('/isbn/:isbn',function (req, res) {
    const book_need = req.params.isbn;
    getBooksbyisbn(book_need).then((ans)=>{
        res.send(ans);
    }).catch(()=>{
        res.status(300).json({message: "there was a problem"})
      })
    
    
 });

 function getBooksbyauthor(author){
     const allBooks = Object.values(books);

    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(allBooks.filter((book) => book.author === author))
        },200)})

    return myPromise;
    
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authors = req.params.author;
    // const book_arrs =  Object.values(books);
  
    // const book = book_arrs.filter((book) => book.author === authors);

    // res.status(200).json(book);

    getBooksbyauthor(authors).then((ans)=>{
        res.send(ans);
    }).catch(()=>{
        res.status(300).json({message: "there was a problem"})
    })
    
});


function getBooksbytitle(title){
    const allBooks = Object.values(books);

   let myPromise = new Promise((resolve,reject) => {
       setTimeout(() => {
           resolve(allBooks.filter((book) => book.title === title))
       },200)})

   return myPromise;
   
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooksbytitle(title).then((ans)=>{
        res.send(ans);
    }).catch(()=>{
        res.status(300).json({message: "there was a problem"})
    })
    // const book_arr = Object.values(books);
    // const book = book_arr.filter((book) => book.title === title);
    // res.status(200).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book_isbn = req.params.isbn;
    const book = books[book_isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;
