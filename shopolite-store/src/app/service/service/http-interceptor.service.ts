import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse, HttpSentEvent, HttpUserEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError as observableThrowError, from  } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { catchError, switchMap, take, finalize } from 'rxjs/operators';
import { EndPointConst } from '../../constants/end-point.const';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
	behaviorSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null as any);

  constructor(public AuthService: AuthServiceService, public ionStorage: StorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    let promise: any = this.ionStorage.get('token');
    return from(promise).pipe(
      switchMap((token: any) => {
        if (token) {
          request = this.setTokenHeader(request, token || {})
        }
    return next.handle(request).pipe(
      catchError(error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status == 401) {
              return this.retryHttp(request, next);
            }
            return observableThrowError(error.error);
          }
      })
    )
      }
    ))
 

  }


  private retryHttp(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url !== EndPointConst.REFRESH_TOKEN) {
      // Rest the token and wait
      this.behaviorSubject.next(null as any);
      let getRefreshToken = this.ionStorage.get('refreshToken');
      return from(getRefreshToken).pipe(
        switchMap((refreshToken: any) => {
          return this.AuthService.refreshToken(refreshToken).pipe(
            switchMap((res: any) => {
              if (res.access_token) {
                this.behaviorSubject.next(res.access_token);
                this.ionStorage.set('token', res.access_token);
                return next.handle(this.setTokenHeader(request, res.access_token));
              }
              return of(this.AuthService.logout())
            }),
            catchError(err => {
              console.log(err);
              if (err.status === 401) {
                this.AuthService.moveUserOut();
              }
              return observableThrowError(err);
            }),
            finalize(() => {
              return of({}) as Observable<HttpEvent<any>>;
            })
          )
        })
      )

    } else {
			return this.behaviorSubject
				.pipe(take(1),
					switchMap(token => {
						if (token) {
							return next.handle(this.setTokenHeader(request, token));
						}
            this.AuthService.moveUserOut();
						return of({}) as Observable<HttpEvent<any>>;
					}));
    }
  }


  private   setTokenHeader(request: HttpRequest<any>, accessToken: any): HttpRequest<any> {
		return request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
	}


}
