import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseDataSource, DataSourceContext } from '@services/data-sources/base.data-source';
import { UploadService } from '@services/upload.service';
import { User } from 'app/models/user';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserDataSource extends BaseDataSource<User> {
    protected dataSource$ = this.http.get<User>(`${environment.apiUrl}/account/user`, {
        withCredentials: true,
    });

    constructor(
        private uploadService: UploadService,
        private http: HttpClient,
        private dataSourceContext: DataSourceContext
    ) {
        super(dataSourceContext);
    }

    uploadAvatar(avatar: File): Observable<void> {
        const formData = new FormData();
        formData.append('avatar', avatar);

        return this.uploadService
            .upload(formData, `${environment.apiUrl}/account/upload-avatar`)
            .pipe(tap(() => this.reload()));
    }
}
