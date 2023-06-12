import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',loadChildren:()=>import('./pages/student/student.module').then(m=>m.StudentModule)},
  {path:'admin',loadChildren:()=>import('./pages/admin/admin.module').then(m=>m.AdminModule)}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
