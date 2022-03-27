import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'main-page',
    loadChildren: () => import('./pages/main-page/main-page.module').then(m => m.MainPageModule),
    // canActivate: [true],
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found-page/not-found-page.module').then(m => m.NotFoundPageModule)
  },
  {
    path: '**',
    redirectTo: 'main-page'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' },
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
