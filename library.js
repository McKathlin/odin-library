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
bookListNode.replaceChildren();
for (const currentBook of library) {
    // TODO: Make book display fancier
    let listItem = document.createElement("li");
    listItem.classList.add("book");
    listItem.textContent = currentBook.info();
    console.log(Object.getPrototypeOf(currentBook));
    bookListNode.appendChild(listItem);
}