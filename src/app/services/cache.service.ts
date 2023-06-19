import { Injectable } from '@angular/core';
import { DataSubject } from 'rxjs-data-subject';

@Injectable({
    providedIn: 'root',
})
export class CacheService {
    private dataServices: DataSubject<any>[] = [];

    register(service: DataSubject<any>): void {
        if (!this.dataServices.find((s) => s === service)) {
            this.dataServices.push(service);
        }
    }

    unRegister(service: DataSubject<any>): void {
        this.dataServices = this.dataServices.filter((s) => s !== service);
    }

    reloadAll(): void {
        this.dataServices.forEach((service) => service.reload());
    }
}
