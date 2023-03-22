import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    constructor(private http: HttpClient) {}

    upload(formData: FormData, endpoint: string): Observable<void> {
        return this.http.post<void>(endpoint, formData, {
            reportProgress: true,
            responseType: 'json',
            withCredentials: true,
        });
    }
}
