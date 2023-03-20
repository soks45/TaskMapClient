import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    constructor(private http: HttpClient) {}

    upload(file: File, endpoint: string): Observable<void> {
        const formData = new FormData();
        formData.append('avatart', file);

        return this.http.post<void>(endpoint, formData, {
            reportProgress: true,
            responseType: 'json',
            withCredentials: true,
        });
    }
}
