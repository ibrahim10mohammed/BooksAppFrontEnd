import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BooksService } from '../services/books.service';
import { FormsModule } from '@angular/forms';
import { Book } from '../ViewModels/book';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
declare const bootstrap: any;

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [ ReactiveFormsModule,FormsModule,ToastrModule,CommonModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  bookForm:Book = { id: 0, title: '', authorName: '',publicationDate:new Date(),quantity:0 };
  isEditMode = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalCount: number = 0;
  visiblePages: number[] = [];
  searchKeyword:string='';
  books:any[]=[];
  constructor(private bookService:BooksService,private toastr: ToastrService){

  }
  ngOnInit(): void {
    this.getBooks();
  }
  onAdd(): void {
    this.isEditMode = false;
    this.bookForm = { id: 0, title: '', authorName: '', publicationDate: new Date(), quantity: 0 };
  }
  onEdit(book: any): void {
    this.bookForm = { ...book };
    this.bookForm.publicationDate = new Date(book.publicationDate);
    this.isEditMode = true;
  }
  dismissPopUp(){
    const modalElement = document.getElementById('bookModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
  onSubmit(): void {
    if (this.isEditMode) {
      // Edit existing book
      const index = this.books.findIndex((b) => b.id === this.bookForm.id);
      if (index !== -1) {
        this.books[index] = { ...this.bookForm };
      }
      this.bookService.updateBook(this.books[index]).subscribe(res=>{
        console.log(res);
        this.toastr.success("Book Updated SuccessFully...!");
        this.isEditMode=false;
        this.bookForm={id: 0, title: '', authorName: '',publicationDate:new Date(),quantity:0};
        this.dismissPopUp();
      })
    } else {
      // Add new book
      const newBook:Book = {
        ...this.bookForm,
      };
      this.bookService.createBook(newBook).subscribe(res=>{
        console.log(res);
        this.toastr.success("Book Created SuccessFully...!");
        this.getBooks();
        this.bookForm={id: 0, title: '', authorName: '',publicationDate:new Date(),quantity:0};
        this.dismissPopUp();
      },err=>{
        console.log(err);
      })
      //this.books.push(newBook);
    }
  }
  onDelete(bookId: number): void {
    console.log('Delete book with ID:', bookId);
    this.books = this.books.filter((book) => book.id !== bookId);
    this.bookService.deleteBook(bookId).subscribe(res=>{
      this.toastr.success("Book Deleted SuccessFully...!");
      this.getBooks();
    })
  }

  clearForm(): void {
    this.bookForm = { id: 0, title: '', authorName: '', publicationDate: new Date(),quantity:0 };
    this.isEditMode = false;
  }

  
  getBooks(){
    this.bookService.getBooks(this.searchKeyword,this.currentPage,this.pageSize).subscribe(response=>{
      this.books = response.items;
      this.totalCount = response.totalCount;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.calculateVisiblePages();
    });
  }
  calculateVisiblePages(): void {
    const maxPagesToShow = 5; // Limit to 5 page links
    const half = Math.floor(maxPagesToShow / 2);

    let start = Math.max(this.currentPage - half, 1);
    let end = Math.min(start + maxPagesToShow - 1, this.totalPages);

    // Adjust if we are near the end
    if (end - start < maxPagesToShow - 1) {
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    this.visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  onPageChange(page: number): void {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.getBooks();
    }
  }

  onPrevious(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getBooks();
    }
  }

  onNext(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getBooks();
    }
  }
  toggleBorrow(book:any,isBorrow:boolean){
    if(isBorrow){
      this.bookService.returnBook(book.id).subscribe(res=>{
        console.log(res);
        this.toastr.success("Book Returned SuccessFully...!");
        this.getBooks();
      });
    }else{
      this.bookService.borrowBook(book.id).subscribe(res=>{
        console.log(res);
        this.toastr.success("Book Borrowed SuccessFully...!");
        this.getBooks();
      });
    }
  }
}
