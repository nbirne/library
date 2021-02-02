let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.index = myLibrary.length;
}

Book.prototype.makeCard = function () {
  let cardTemplate = document.getElementById("cardTemplate");
  let card = cardTemplate.content.cloneNode(true);

  card.querySelector(".title").textContent = this.title;
  card.querySelector(".author").textContent = `Author: ${this.author}`;
  card.querySelector(".pages").textContent = `Pages: ${this.pages}`;
  card.querySelector(".read p").textContent = "Status (click to change): ";
  card.querySelector(".read button").textContent = this.read;
  card.querySelector(".card").classList.add((this.read === "Read") ? "read-book" : "unread-book");

  // Set up event listeners for when the "read" and "trash" buttons are clicked
  card.querySelector(".read button").addEventListener("click", e => this.toggleRead());
  card.querySelector(".trash").addEventListener("click", e => this.deleteBook());

  return card;
}

Book.prototype.toggleRead = function() {
  this.read = (this.read === "Read") ? "Not Read" : "Read";
  let card = document.querySelectorAll(".card")[this.index];
  card.querySelector(".read button").textContent = this.read;
  updateLog();
  populateStorage();

  // Style card with correct colors
  card.classList.toggle("read-book");
  card.classList.toggle("unread-book");
}

Book.prototype.deleteBook = function() {
  // Remove book from display
  document.querySelectorAll(".card")[this.index].remove();
  // Remove book from library array
  myLibrary.splice(this.index, 1);
  // Update index for each book
  myLibrary.forEach((book, index) => book.index = index);

  populateStorage();
  updateLog();
}

function addBookToLibrary(e) {
  e.preventDefault();
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let read = document.getElementById("read").value;

  if (!(title && author && pages)) alert("Must enter all fields.");
  else if (!Number.isInteger(+pages)) alert("Invalid number of pages.");
  else {
    e.target.reset();
    myLibrary.push(new Book(title, author, pages, read));
    populateStorage();
    displayLibrary();
    updateLog();
    toggleForm();
  }
}

function displayLibrary() {
  let cards = document.querySelectorAll(".card");
  cards.forEach(card => card.remove());
  
  let container = document.getElementById("container");
  myLibrary.forEach(book => container.appendChild(book.makeCard()));
}

function updateLog() {
  let counter = {bookCount: 0, pageCount: 0};
  myLibrary.forEach(book => {
    if (book.read === "Read") {
      counter.bookCount++;
      counter.pageCount += Number(book.pages);
    }
  });

  document.querySelector("#bookCount").textContent = `Books Read: ${counter.bookCount}`;
  document.querySelector("#pageCount").textContent = `Pages Read: ${counter.pageCount}`;
}

function toggleForm() {
  let form = document.getElementById("add-book-form");
  form.classList.toggle("show-form");
}

document.getElementById("add-book-form").addEventListener("submit", addBookToLibrary);
document.getElementById("add-book-button").addEventListener("click", toggleForm);

// On page load, set up myLibrary with stored list of books
function setLibrary() {
  myLibrary = JSON.parse(localStorage.getItem("libraryStorage") || "[]");
  // Give stored books access to the Book prototype
  myLibrary.forEach((obj, index) => myLibrary[index] = Object.assign(new Book(), obj));
}

// Store list of books
function populateStorage() {
  localStorage.setItem("libraryStorage", JSON.stringify(myLibrary));
}

// Retrieve library from local storage
if(!localStorage.getItem("libraryStorage")) {
  myLibrary.push(new Book("A Gentleman In Moscow", "Amor Towles", "462", "Not Read"));
  populateStorage();
} else {
  setLibrary();
}

console.log(myLibrary);

displayLibrary();
updateLog();