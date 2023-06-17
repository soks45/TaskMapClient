import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ShortUser } from 'app/models/user';
import { DataSubject } from 'rxjs-data-subject';

@Injectable({
    providedIn: 'root',
})
export class UsersDataSource extends DataSubject<ShortUser[]> {
    constructor(private http: HttpClient) {
        super(
            http.get<ShortUser[]>(`${environment.apiUrl}/account/list`, {
                withCredentials: true,
            })
        );
    }
}
