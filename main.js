document.addEventListener('DOMContentLoaded', () => {
   const bookForm = document.getElementById('bookForm');
   const searchBookForm = document.getElementById('searchBook');
   const incompleteBookList = document.getElementById('incompleteBookList');
   const completeBookList = document.getElementById('completeBookList');
   const bookFormIsComplete = document.getElementById('bookFormIsComplete');
   const bookFormSubmit = document.getElementById('bookFormSubmit');
   
   // kaya state di react
   let books = [];
   let editingBookId = null;
   
   const initBookshelfApp = () => {
      loadBooksFromStorage();
      renderBooks();
      setupEventListeners();
      updateSubmitButtonText();
   }
   
   const setupEventListeners = () => {
      bookForm.addEventListener('submit', handleAddOrEditBook);
      searchBookForm.addEventListener('submit', handleSearchBooks);
      bookFormIsComplete.addEventListener('change', updateSubmitButtonText);
   }
   
   const handleAddOrEditBook = (event) => {
      event.preventDefault();
      const book = createBookFromForm();
      if (editingBookId) {
         updateBook(book);
         alert(`Buku "${book.title}" berhasil diperbarui!`);
      } else {
         addBook(book);
         alert(`Buku "${book.title}" berhasil ditambahkan ke rak!`);
      }
      bookForm.reset();
      editingBookId = null;
      bookFormSubmit.textContent = 'Masukkan Buku ke rak';
      updateSubmitButtonText();
   } 
   
   const createBookFromForm = () => {
      return {
         id: editingBookId || Date.now(),
         title: document.getElementById('bookFormTitle').value,
         author: document.getElementById('bookFormAuthor').value,
         year: parseInt(document.getElementById('bookFormYear').value, 10),
         isComplete: bookFormIsComplete.checked
      };
   }
   
   const addBook = (book) => {
      books.push(book);
      saveToStorage();
      renderBooks();
   }
   
   const updateBook = (updatedBook) => {
      books = books.map(book => book.id === updatedBook.id ? updatedBook : book);
      saveToStorage();
      renderBooks();
   }
   
   const handleSearchBooks = (event) => {
      event.preventDefault();
      const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
      const filteredBooks = books.filter(book => 
         book.title.toLowerCase().includes(searchTerm)
      );
      renderBooks(filteredBooks);
   }
      
   const toggleBookStatus = (bookId) => {
      books = books.map(book => 
         book.id === bookId ? { ...book, isComplete: !book.isComplete } : book
      );
      saveToStorage();
      renderBooks();
   }
         
   const deleteBook = (bookId) => {
      const book = books.find(book => book.id === bookId);
      if (confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}"?`)) {
         books = books.filter(book => book.id !== bookId);
         saveToStorage();
         renderBooks();
         alert(`Buku "${book.title}" berhasil dihapus.`);
      }
   } 
         
   const editBook = (bookId) => {
      const book = books.find(book => book.id === bookId);
      if (book) {
         document.getElementById('bookFormTitle').value = book.title;
         document.getElementById('bookFormAuthor').value = book.author;
         document.getElementById('bookFormYear').value = book.year;
         bookFormIsComplete.checked = book.isComplete;
         editingBookId = book.id;
         bookFormSubmit.textContent = 'Edit Buku';
         updateSubmitButtonText();
      }
   }
         
   const renderBooks = (booksToRender = books) => {
      clearBookLists();
      booksToRender.forEach(renderBook);
   }
         
   const clearBookLists = () => {
      incompleteBookList.innerHTML = '';
      completeBookList.innerHTML = '';
   }
         
   const renderBook = (book) => {
      const bookElement = createBookElement(book);
      const targetList = book.isComplete ? completeBookList : incompleteBookList;
      targetList.appendChild(bookElement);
   }
         
   const createBookElement = (book) => {
      const bookElement = document.createElement('div');
      bookElement.dataset.bookid = book.id;
      bookElement.dataset.testid = 'bookItem';
      bookElement.innerHTML = `
         <div class="p-2 rounded border">
            <h3 data-testid="bookItemTitle" class='font-bold text-xl'>${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
            <button data-testid="bookItemIsCompleteButton" class='bg-blue-400 text-white p-1 rounded hover:bg-blue-500'>${book.isComplete ? 'Pindah rak belum selesai' : 'Pindah rak Selesai'}</button>
            <button data-testid="bookItemDeleteButton" class='bg-red-400 text-white rounded hover:bg-red-500 p-1'>Hapus Buku</button>
            <button data-testid="bookItemEditButton" class='bg-yellow-400 hover:bg-yellow-500 p-1 text-white rounded'>Edit Buku</button>
            </div>
         </div>`;
            
      setupBookElementListeners(bookElement, book.id);
      return bookElement;
   }
         
   const setupBookElementListeners = (bookElement, bookId) => {
      const toggleButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
      const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
      const editButton = bookElement.querySelector('[data-testid="bookItemEditButton"]');
            
      toggleButton.addEventListener('click', () => toggleBookStatus(bookId));
      deleteButton.addEventListener('click', () => deleteBook(bookId));
      editButton.addEventListener('click', () => editBook(bookId));
   }
         
   const updateSubmitButtonText = () => {
      const spanElement = bookFormSubmit.querySelector('span');
      if (spanElement) {
         spanElement.textContent = bookFormIsComplete.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
      }
   }
         
   const loadBooksFromStorage = () => {
      const storedBooks = localStorage.getItem('books');
      books = storedBooks ? JSON.parse(storedBooks) : [];
   }
         
   const saveToStorage = () => {
      localStorage.setItem('books', JSON.stringify(books));
   }
         
   initBookshelfApp();
});