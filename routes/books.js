var express = require('express');
var router = express.Router();
const fs = require('fs');

let htmlHead = `<title>Vårt bibliotek</title><link rel="stylesheet" href="/stylesheets/style.css">`

// let books = [
//   {
//     title: "Barbapappa",
//     author: "Kent Kentsson",
//     pages: "10",
//     rented: false,
//     id: 1
//   },
//   {
//     title: "Faktabok om dinosaurier",
//     author: "Anna Andersson",
//     pages: "48",
//     rented: true,
//     id: 2
//   },
//   {
//     title: "Lilla räv",
//     author: "Sten Stensson",
//     pages: "17",
//     rented: false,
//     id: 3
//   },
//   {
//     title: "Spöket laban",
//     author: "Sören Sörensson",
//     pages: "28",
//     rented: true,
//     id: 4
//   },
// ]

/* GET users listing. */


router.get('/', function(req, res, next) {
  fs.readFile("books.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let books = JSON.parse(data);

    // res.json(books);
  

  
  let printBooks = htmlHead + `<h1>Vårt bibliotek</h1><div><h2>Alla böcker</h2>`
  
  for (book in books) {
    if (books[book].rented === false) {
    printBooks += `<div>${books[book].title} <a href="/books/${books[book].id}">Mer info</a> 
    <a href="/books/rent/${books[book].id}"><button id="true" type="rent">Låna boken</button></a>
    </div>` 
    } else {
    printBooks += `<div>${books[book].title} <a href="/books/${books[book].id}">Mer info</a> 
    <button id="false" type="rent">Utlånad</button>
    </div>` 
    }
  }

  printBooks += `<div id=link><a href="/books/addbook">Lägg till ny bok</a></div></div>`

  res.send(printBooks);
})
});


{/* <input type="button" id=btn value="LÅNA" enabled></input>
<input type="button" id=btn value="UTLÅNAD" disabled></input> */}

router.get("/addbook", function(req, res){
  let addBook = htmlHead + `<h1>Lägg till bok</h1>
                <form action="/books/addbook" method="post">Bokens titel<br>
                <input type="text" name="title"><br>
                Författare<br>
                <input type="text" name="author"><br>
                Antal sidor<br>
                <input type="numbers" name="pages"><br>
                <button type="submit">Lägg till</button></form>`
                res.send(addBook);
})

router.post("/addbook", function(req, res){
  console.log(req.body);

  fs.readFile('books.json', function(err, data) {
    if (err) {
      console.log(err);
    }
    let books = JSON.parse(data);

    let newBook = 
    {
      title: req.body.title,
      author: req.body.author,
      pages: req.body.pages,
      rented: false,
      id: books.length + 1
    }
    
    books.push(newBook);

    fs.writeFile('books.json', JSON.stringify(books, null, 2), function(err) {
      if (err) {
        console.log(err);
      }
    })
  })

  res.redirect("/books");

})


router.get('/:id', function(req, res){

  fs.readFile("books.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let books = JSON.parse(data);

  const book = books.find(b => b.id === parseInt(req.params.id));
  console.log(book);
  const rented = book.rented;
  let answer;

  if (rented === false) {
  answer = `<a href="/books/rent/`+ req.params.id + `"><button id="true" type="rent">Låna boken</button></a>` 
  } else {
  answer = `<button id="false" type="rent">Utlånad</button>` 
  }

    let bookInfo = htmlHead + `<h1>${book.title}</h1><br>
                <h2>Om boken</h2>
                <p>Författare: ${book.author}<br>
                <p>Titel: ${book.title}<br>
                <p>Antal sidor: ${book.pages}<br>
                ` + answer

  res.send(bookInfo);
})
});

router.get("/rent/:id", function(req, res){
  fs.readFile("books.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let books = JSON.parse(data);

  const book = books.find(b => b.id === parseInt(req.params.id));
  book.rented = true;

  console.log(req.params.id);
  console.log(book);
  // res.send("Boken lånad!");
  fs.writeFile('books.json', JSON.stringify(books, null, 2), function(err) {
    if (err) {
      console.log(err);
    }
  })

  // res.json(book);
  res.redirect("/books");

})
});


router.post("/rent/:id", function(req, res){
  fs.readFile("books.json", function(err, data) {
    if(err) {
      console.log(err);
    }
    let books = JSON.parse(data);


  fs.writeFile('books.json', JSON.stringify(books, null, 2), function(err) {
    if (err) {
      console.log(err);
    }
  })

  res.redirect("/books");

})
});


module.exports = router;
