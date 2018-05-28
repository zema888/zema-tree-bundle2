import {Observable} from "rxjs/internal/Observable";
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppInterceptorService {
    static host: string;

    constructor() { }

    private createUrl(path) {
        return AppInterceptorService.host + path;
    }

    private isIntercept(url: string): Boolean {
        const parts = url.split('/');
        return true;
        // if (parts.length > 0) {
        //     return [
        //         'users',
        //         'common',
        //         'customer'
        //     ].indexOf(parts[0]) > -1;
        // }
        // return false;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let params;
        if (this.isIntercept(req.url)) {
            params = {
                url: this.createUrl(req.url)
            };
        } else {
            params = {};
        }
        const clonedRequest = req.clone(params);
        return next.handle(clonedRequest);
    }
}
