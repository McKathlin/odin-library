//=============================================================================
// Library class
//=============================================================================

class Library {
    constructor() {
        this._bookById = {};
        this._nextBookId = 1;
        this._bookCount = 0;
    }

    get books() {
        return Object.values(this._bookById);
    }

    getBookById(id) {
        if (id in this._bookById) {
            return this._bookById[id];
        } else {
            return null;
        }
    }

    addBook(title, author, pageCount, haveRead) {
        let addedBook = new Book(title, author, pageCount, haveRead);
        addedBook.register(this._nextBookId++);
        this._bookById[addedBook.id] = addedBook;
        this._bookCount++;
    }

    removeBook(idToRemove) {
        if (idToRemove in this._bookById) {
            delete this._bookById[idToRemove];
            return true;
        } else {
            return false;
        }
    }
}

//=============================================================================
// Library.Book
//=============================================================================

class Book {
    constructor(title, author, pageCount, haveRead=false) {
        this.title = title;
        this.author = author;
        this.pageCount = pageCount;
        this.isRead = haveRead;
        this._id = null;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        if (null === this._id) {
            this._id = value;
        } else {
            throw new Error(`Book already has ID of ${this._id}`);
        }
    }

    register(uniqueId) {
        this.id = uniqueId;
    }

    info() {
        let readStatus = this.isRead ? "read" : "not read yet";
        return `${this.title} by ${this.author}, ${this.pageCount} pages, ${readStatus}`;
    }

    markRead(read=true) {
        this.isRead = read;
    }
}

//=============================================================================
// Nodes
//=============================================================================

const bookListNode = document.getElementById("book-list");

const newBookContainer = document.getElementById("new-book-container");
const showNewFormButton = document.getElementById("show-new-book-form");

const newTitleInput = document.getElementById("new-title");
const newAuthorInput = document.getElementById("new-author");
const newPageCountInput = document.getElementById("new-page-count");
const newHaveReadCheckbox = document.getElementById("new-have-read");
const requiredNewBookFields = [newTitleInput, newAuthorInput, newPageCountInput];

const newBookButton = document.getElementById("add-new-book");
const cancelNewBookButton = document.getElementById("cancel-new-book");

showNewFormButton.addEventListener("click", function(event) {
    LibraryController.showNewBookForm();
});

newBookButton.addEventListener("click", function(event) {
    LibraryController.addBookUsingForm();
});

cancelNewBookButton.addEventListener("click", function(event) {
    LibraryController.hideNewBookForm();
})

//=============================================================================
// LibraryView
//=============================================================================

LibraryView = (function() {

    const populate = function(books) {
        bookListNode.replaceChildren();
        for (const currentBook of books) {
            let listItem = _makeBookNode(currentBook);
            bookListNode.appendChild(listItem);
        }
        bookListNode.appendChild(newBookContainer);
    };

    const refreshBook = function(bookId) {
        const bookNode = bookListNode.querySelector(`.book[book-id="${bookId}"]`);
        if (!bookNode) {
            return;
        }
        _refreshBookNode(bookNode);
    };

    const showNewBookForm = function() {
        newBookContainer.classList.add("add-mode");
    };

    const hideNewBookForm = function() {
        // Hide the form
        newBookContainer.classList.remove("add-mode");
    
        // Clear the inputs
        newTitleInput.value = "";
        newAuthorInput.value = "";
        newPageCountInput.value = "";
        newHaveReadCheckbox.checked = false;
    };

    const _makeBookNode = function(theBook) {
        let bookNode = document.createElement("div");
        bookNode.setAttribute("book-id", theBook.id);
        bookNode.classList.add("book");
    
        let titleNode = document.createElement("p");
        titleNode.classList.add("title-line");
        bookNode.appendChild(titleNode);
    
        let authorNode = document.createElement("p");
        authorNode.classList.add("author-line");
        bookNode.appendChild(authorNode);
    
        let pageCountNode = document.createElement("p");
        pageCountNode.classList.add("page-count-line");
        bookNode.appendChild(pageCountNode);
    
        let isReadNode = document.createElement("p");
        isReadNode.classList.add("is-read-line");
        bookNode.appendChild(isReadNode);
    
        let actionIcons = document.createElement("div");
        actionIcons.classList.add("book-actions");
        actionIcons.appendChild(_makeToggleReadButton(theBook));
        actionIcons.appendChild(_makeDeleteButton(theBook));
        bookNode.appendChild(actionIcons);
    
        _refreshBookNode(bookNode);
    
        return bookNode;
    };

    const _refreshBookNode = function(bookNode) {
        const bookModel = LibraryController.getBookById(
            bookNode.getAttribute("book-id"));
        if (!bookModel) {
            throw new Error("Book not found for refresh");
        }
    
        if (bookModel.isRead) {
            bookNode.classList.remove("unread");
            bookNode.classList.add("read");
        } else {
            bookNode.classList.remove("read");
            bookNode.classList.add("unread");
        }
    
        const titleNode = bookNode.querySelector(".title-line");
        titleNode.textContent = bookModel.title;
    
        const authorNode = bookNode.querySelector(".author-line");
        authorNode.textContent = `by ${bookModel.author}`;
    
        const pageCountNode = bookNode.querySelector(".page-count-line");
        pageCountNode.textContent = `${bookModel.pageCount} pages`;
    
        const isReadNode = bookNode.querySelector(".is-read-line");
        isReadNode.textContent = bookModel.isRead ?
            "You've read it!" : "You have not read this book yet.";
    };

    const _makeToggleReadButton = function(targetBook) {
        let toggleButton = document.createElement("button");
        toggleButton.classList.add("toggle-read");
        toggleButton.setAttribute("book-id", targetBook.id);
        toggleButton.addEventListener("click", function(event) {
            console.log("Toggle button clicked!");
            const bookId = event.target.getAttribute("book-id");
            if (!bookId) {
                return; // Can't find book to edit
            }
            LibraryController.toggleRead(bookId);
        })
        return toggleButton;
    };

    const _makeDeleteButton = function(targetBook) {
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.setAttribute("book-id", targetBook.id);
        deleteButton.addEventListener("click", function(event) {
            console.log("Delete button clicked!");
            const bookId = event.target.getAttribute("book-id");
            const book = LibraryController.getBookById(bookId);
            if (!book) {
                return; // Can't find book to delete it
            }
            const confirmed = confirm(
                `${book.info()}
                Do you really want to delete this book?`
            );
            if (confirmed) {
                LibraryController.removeBook(book.id);
            }
        });
        return deleteButton;
    };

    return {
        populate,
        refreshBook,
        showNewBookForm,
        hideNewBookForm
    };
})();

//=============================================================================
// LibraryController
//=============================================================================

LibraryController = (function() {

    const getBookById = function(id) {
        return myLibrary.getBookById(id);
    };

    const showNewBookForm = function() {
        LibraryView.showNewBookForm();
    };

    const hideNewBookForm = function() {
        LibraryView.hideNewBookForm();
    };

    const addBookUsingForm = function() {
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
            addBook(title, author, numPages, isRead);
        }
    };

    const addBook = function(title, author, pageCount, isRead) {
        myLibrary.addBook(title, author, pageCount, isRead);
        LibraryView.populate(myLibrary.books);
        LibraryView.hideNewBookForm();
    };

    const removeBook = function(id) {
        myLibrary.removeBook(id);
        LibraryView.populate(myLibrary.books);
    };
    
    const toggleRead = function(id) {
        let book = myLibrary.getBookById(id);
        book.markRead(!book.isRead);
        LibraryView.refreshBook(id);
    };

    return {
        getBookById,
        showNewBookForm,
        hideNewBookForm,
        addBookUsingForm,
        addBook,
        removeBook,
        toggleRead
    };
})();


//=============================================================================
// Page setup
//=============================================================================

let myLibrary = new Library();
myLibrary.addBook("The Hobbit", "J.R.R. Tolkien", 295, true);
myLibrary.addBook("Jokes A to Z", "Joe King", 26, false);
myLibrary.addBook("Stories from Danger's Den", "McKathlin", 1000, false);

LibraryView.populate(myLibrary.books);