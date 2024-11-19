import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private baseUrl = 'https://localhost:7140/api';

  constructor(private http: HttpClient, private logger: LoggingService) { }

  // Login
  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/Auth/login`;
    return this.http.post(url, { email, password }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // Register
  register(userData: any): Observable<any> {
    const url = `${this.baseUrl}/Auth/register`;
    return this.http.post(url, userData).pipe(
      catchError((error) => this.handleError(error))
    );
  }
  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.baseUrl}/Auth/refresh`, { refreshToken });
  }
  // Fetch Books
  getBooks(searchKeyword:string,pageNumber: Number, pageSize: Number): Observable<any> {
    const url = `${this.baseUrl}/Book/AllBooks?keyword=${searchKeyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get(url).pipe(
      catchError((error) => this.handleError(error))
    );
  }
  createBook(book:any){
    const url = `${this.baseUrl}/Book/Create`;
    return this.http.post(url,  book ).pipe(
      catchError((error) => this.handleError(error))
    );
  }
  updateBook(book:any){
    const url = `${this.baseUrl}/Book/Update`;
    return this.http.put(url,  book ).pipe(
      catchError((error) => this.handleError(error))
    );
  }
  deleteBook(id:number){
    const url = `${this.baseUrl}/Book/Delete?id=${id}`;
    return this.http.delete(url ).pipe(
      catchError((error) => this.handleError(error))
    );
  }
  borrowBook(bookId:number){
    const url = `${this.baseUrl}/Book/borrow`;
    return this.http.put(url,  {bookId} ).pipe(
      catchError((error) => this.handleError(error))
    );
  }
  returnBook(bookId:number){
    const url = `${this.baseUrl}/Book/return`;
    return this.http.put(url,  {bookId} ).pipe(
      catchError((error) => this.handleError(error))
    );
  }
  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.logger.error(`HTTP Error: ${error.message}`);
    return throwError(() => new Error(error.message));
  }
}
