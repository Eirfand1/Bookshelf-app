document.addEventListener('DOMContentLoaded', function () {
  const inputBook = document.getElementById('inputBook');
  const inputCari = document.querySelector('.inputCari');
  const searchBookButton = document.querySelector('.submitCari');
  const belumSelesaiContainer = document.querySelector('.container-belumSelesai');
  const sudahDibacaContainer = document.querySelector('.container-dibaca');

  let booksData = getBooksDataFromLocalStorage() || [];

  displayBooks();

  inputBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    saveToLocalStorage();
  });

  searchBookButton.addEventListener('click', function () {
    const searchTerm = inputCari.value ? inputCari.value.toLowerCase() : '';
    const filteredBooks = booksData.filter(book => book.title.toLowerCase().includes(searchTerm));
    displayBooks(filteredBooks);
  });

  function addBook() {
    const judulInput = document.querySelector('.inptJudul');
    const penulisInput = document.querySelector('.inputPenulis');
    const tahunInput = document.querySelector('.inputTahun');
    const selesaiDibacaCheckbox = document.querySelector('.checkbox');
    const year = parseInt(tahunInput.value, 10);

    const book = {
      id: generateId(),
      title: judulInput.value,
      author: penulisInput.value,
      year: year,
      isComplete: selesaiDibacaCheckbox.checked
    };

    booksData.push(book);

    displayBooks();
    clearForm();
  }

  function displayBooks(filteredBooks = booksData) {
    belumSelesaiContainer.innerHTML = '';
    sudahDibacaContainer.innerHTML = '';

    filteredBooks.forEach(book => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        sudahDibacaContainer.appendChild(bookElement);
      } else {
        belumSelesaiContainer.appendChild(bookElement);
      }
    });
  }

  function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');

    bookElement.innerHTML = `
      <hr>
      <h4>Judul : ${book.title}</h4>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
      <button class="moveButton" style="background-color: cyan; color: black;">Pindah</button>
      <button class="deleteButton" style="background-color: red;">Hapus</button>
    `;

    const moveButton = bookElement.querySelector('.moveButton');
    const deleteButton = bookElement.querySelector('.deleteButton');

    moveButton.addEventListener('click', function () {
      moveBook(book);
      saveToLocalStorage();
    });

    deleteButton.addEventListener('click', function () {
      deleteBook(book);
      saveToLocalStorage();
    });

    return bookElement;
  }

  function moveBook(book) {
    book.isComplete = !book.isComplete;
    displayBooks();
  }

  function deleteBook(book) {
    const bookIndex = booksData.findIndex(b => b.id === book.id);
    if (bookIndex !== -1) {
      booksData.splice(bookIndex, 1);
      displayBooks();
    }
  }

  function clearForm() {
    const inputs = document.querySelectorAll('.container-masukanBuku input');
    inputs.forEach(input => (input.value = ''));
    document.querySelector('.checkbox').checked = false;
  }

  function generateId() {
    return +new Date();
  }

  function saveToLocalStorage() {
    localStorage.setItem('booksData', JSON.stringify(booksData));
  }

  function getBooksDataFromLocalStorage() {
    const storedBooksData = localStorage.getItem('booksData');
    return storedBooksData ? JSON.parse(storedBooksData) : [];
  }
});
