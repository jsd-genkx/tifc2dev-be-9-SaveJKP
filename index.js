const express = require("express");
const app = express();

app.use(express.json());

const books = [
  { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction" },
  { id: 3, title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy" },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen", genre: "Fiction" },
];

app.get("/books", (req, res, next) => {
  setTimeout(() => {
    const { genre } = req.query;
    try {
      if (genre) {
        const filteredBooks = books.filter((book) =>
          book.genre.toLowerCase().includes(genre.toLowerCase())
        );
        if (filteredBooks.length > 0) {
          res.send(filteredBooks);
        } else {
          const error = new Error(`No books found for genre: ${genre}`);
          error.statusCode = 404;
          next(error);
        }
      } else {
        res.send(books);
      }
    } catch (err) {
      next(err);
    }
  }, 1000);
});

app.get("/books/:id", async (req, res, next) => {
  try {
    const book = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundBook = books.find(
          (b) => b.id === parseInt(req.params.id, 10)
        );
        if (foundBook) {
          resolve(foundBook);
        } else {
          const error = new Error(`Book with ID ${req.params.id} not found`);
          error.statusCode = 404;
          reject(error);
        }
      }, 1000);
    });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || "Internal Server Error",
  };
  if (app.get("env") === "development") {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});