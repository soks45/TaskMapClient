import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseDataSource, DataSourceContext } from '@services/data-sources/base.data-source';
import { ShortUser } from 'app/models/user';

@Injectable({
    providedIn: 'root',
})
export class UsersDataSource extends BaseDataSource<ShortUser[]> {
    protected dataSource$ = this.http.get<ShortUser[]>(`${environment.apiUrl}/account/list`, {
        withCredentials: true,
    });

    constructor(private http: HttpClient, private dataSourceContext: DataSourceContext) {
        super(dataSourceContext);
    }
}
