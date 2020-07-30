import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent as AMAppComponent } from '@am/src/app/app.component';

const routes: Routes = [
  { path: 'am', component: AMAppComponent },
  { path: '', redirectTo: '/am', pathMatch: 'full' }, // redirect to `first-component`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
