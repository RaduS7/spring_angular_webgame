import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpInterceptor } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = this.localStorage.get("token");

    console.log(token);

    let jwtToken = req.clone({
      setHeaders: {
        Authorization: "bearer " + token
      }
    })

    return next.handle(jwtToken);
  }
}
