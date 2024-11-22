//=============================================================================
// Library class
//=============================================================================

function Library() {
    this._bookById = {};
    this._nextBookId = 1;
    this._bookCount = 0;
};

Object.defineProperties(Library.prototype, {
    books: {
        get: function() { return Object.values(this._bookById); }
    }
});

Library.prototype.getBookById = function(id) {
    return this._bookById[id];
};

Library.prototype.addBook = function(title, author, pageCount, haveRead) {
    let addedBook = new Book(title, author, pageCount, haveRead);
    addedBook.register(this._nextBookId++);
    this._bookById[addedBook.id] = addedBook;
    this._bookCount++;
};

Library.prototype.removeBook = function(idToRemove) {
    if (this._bookById[idToRemove]) {
        delete this._bookById[idToRemove];
        return true;
    } else {
        return false;
    }
};

//=============================================================================
// Library.Book
//=============================================================================

function Book(title, author, pageCount, haveRead=false) {
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.isRead = haveRead;
    this._id = null;
}

Object.defineProperties(Book.prototype, {
    id: {
        get: function() {
            return this._id;
        },
        set: function(value) {
            if (null === this._id) {
                this._id = value;
            } else {
                throw new Error(`Book already has ID of ${this._id}`);
            }
        }
    }
});

Book.prototype.register = function(uniqueId) {
    this.id = uniqueId;
};

Book.prototype.info = function() {
    let readStatus = this.isRead ? "read" : "not read yet";
    return `${this.title} by ${this.author}, ${this.pageCount} pages, ${readStatus}`;
};

Book.prototype.markRead = function(read=true) {
    this.isRead = read;
};

//=============================================================================
// LibraryView
//=============================================================================

LibraryView = {};

LibraryView.populate = function(books) {
    const bookListNode = document.getElementById("book-list");
    const newBookForm = document.getElementById("new-book-form");
    bookListNode.replaceChildren();
    for (const currentBook of books) {
        let listItem = this.makeBookNode(currentBook);
        bookListNode.appendChild(listItem);
    }
    bookListNode.appendChild(newBookForm);
};

LibraryView.makeBookNode = function(theBook) {
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

    let actionIcons = document.createElement("div");
    actionIcons.classList.add("book-actions");
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    actionIcons.appendChild(deleteButton);
    bookNode.appendChild(actionIcons);

    return bookNode;
}

//=============================================================================
// Controls
//=============================================================================

const newTitleInput = document.getElementById("new-title");
const newAuthorInput = document.getElementById("new-author");
const newPageCountInput = document.getElementById("new-page-count");
const newHaveReadCheckbox = document.getElementById("new-have-read");
const newBookButton = document.getElementById("add-new-book");
const requiredNewBookFields = [newTitleInput, newAuthorInput, newPageCountInput];

newBookButton.addEventListener("click", function() {
    const title = newTitleInput.value;
    const author = newAuthorInput.value;
    const numPages = newPageCountInput.value;
    const isRead = newHaveReadCheckbox.checked;
    let valid = true;
    for (const field of requiredNewBookFields) {
        field.reportValidity();
        if (!field.validity.valid) {
            valid = false;
            break;
        }
    }
    if (valid) {
        LibraryController.addBook(title, author, numPages, isRead);
    }
});

LibraryController = {};

LibraryController.addBook = function(title, author, pageCount, isRead) {
    myLibrary.addBook(title, author, pageCount, isRead);
    LibraryView.populate(myLibrary.books);
}

//=============================================================================
// Page setup
//=============================================================================

let myLibrary = new Library();
myLibrary.addBook("The Hobbit", "J.R.R. Tolkien", 295, true);
myLibrary.addBook("Jokes A to Z", "Joe King", 26, false);
myLibrary.addBook("Stories from Danger's Den", "McKathlin", 1000, false);

LibraryView.populate(myLibrary.books);