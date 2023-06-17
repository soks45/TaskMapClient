import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UploadService } from '@services/upload.service';
import { User } from 'app/models/user';
import { Observable, tap } from 'rxjs';
import { DataSubject } from 'rxjs-data-subject';

@Injectable({
    providedIn: 'root',
})
export class UserDataSource extends DataSubject<User> {
    constructor(private uploadService: UploadService, private http: HttpClient) {
        super(
            http.get<User>(`${environment.apiUrl}/account/user`, {
                withCredentials: true,
            })
        );
    }

    uploadAvatar(avatar: File): Observable<void> {
        const formData = new FormData();
        formData.append('avatar', avatar);

        return this.uploadService
            .upload(formData, `${environment.apiUrl}/account/upload-avatar`)
            .pipe(tap(() => this.reload()));
    }
}
