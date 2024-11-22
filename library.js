//=============================================================================
// Book class
//=============================================================================
function Book(title, author, pageCount, haveRead=false) {
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.isRead = haveRead;
}

Book.prototype.info = function() {
    let readStatus = this.isRead ? "read" : "not read yet";
    return `${this.title} by ${this.author}, ${this.pageCount} pages, ${readStatus}`;
};

Book.prototype.markRead = function(read=true) {
    this.isRead = read;
};

const library = [
    new Book("The Hobbit", "J.R.R. Tolkien", 295, true),
    new Book("Jokes A to Z", "Joe King", 26, false),
    new Book("Stories from Danger's Den", "McKathlin", 1000, false)
];

//=============================================================================
// Library display
//=============================================================================

const bookListNode = document.getElementById("book-list");
const newBookForm = document.getElementById("new-book-form");
bookListNode.replaceChildren();
for (const currentBook of library) {
    let listItem = makeBookNode(currentBook);
    bookListNode.appendChild(listItem);
}
bookListNode.appendChild(newBookForm);

function makeBookNode(theBook) {
    let bookNode = document.createElement("div");
    bookNode.classList.add("book");
    if (theBook.isRead) {
        bookNode.classList.add("read");
    } else {
        bookNode.classList.add("unread");
    }

    let titleNode = document.createElement("p");
    titleNode.classList.add("title-line");
    titleNode.textContent = theBook.title;
    bookNode.appendChild(titleNode);

    let authorNode = document.createElement("p");
    authorNode.classList.add("author-line");
    authorNode.textContent = `by ${theBook.author}`;
    bookNode.appendChild(authorNode);

    let pageCountNode = document.createElement("p");
    pageCountNode.classList.add("page-count-line");
    pageCountNode.textContent = `${theBook.pageCount} pages`;
    bookNode.appendChild(pageCountNode);

    let isReadNode = document.createElement("p");
    isReadNode.classList.add("is-read-line");
    isReadNode.textContent = theBook.isRead ?
        "You've read it!" : "You have not read this book yet.";
    bookNode.appendChild(isReadNode);

    return bookNode;
}