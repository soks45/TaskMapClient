import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BreakPointsService {
    constructor(public breakpointObserver: BreakpointObserver) {}

    readonly bigScreen$: Observable<boolean> = this.breakpointObserver
        .observe(['(min-width: 1200px)'])
        .pipe(map((state: BreakpointState) => state.breakpoints['(min-width: 1200px)']));

    readonly mediumScreen$: Observable<boolean> = this.breakpointObserver
        .observe(['(min-width: 960px)'])
        .pipe(map((state: BreakpointState) => state.breakpoints['(min-width: 960px)']));

    readonly mediumSmallScreen$: Observable<boolean> = this.breakpointObserver
        .observe(['(min-width: 740px)'])
        .pipe(map((state: BreakpointState) => state.breakpoints['(min-width: 740px)']));

    readonly smallScreen$: Observable<boolean> = this.breakpointObserver
        .observe(['(min-width: 480px)'])
        .pipe(map((state: BreakpointState) => state.breakpoints['(min-width: 480px)']));

    readonly tinyScreen$: Observable<boolean> = this.breakpointObserver
        .observe(['(min-width: 320px)'])
        .pipe(map((state: BreakpointState) => state.breakpoints['(min-width: 320px)']));
}
