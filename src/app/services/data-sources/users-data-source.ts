import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseDataSource } from '@services/data-sources/base.data-source';
import { ShortUser } from 'app/models/user';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersDataSource extends BaseDataSource<ShortUser[]> {
    protected dataSource$: Observable<ShortUser[]> = this.http.get<ShortUser[]>(`${environment.apiUrl}/account/list`, {
        withCredentials: true,
    });

    constructor(private http: HttpClient) {
        super();
    }
}
