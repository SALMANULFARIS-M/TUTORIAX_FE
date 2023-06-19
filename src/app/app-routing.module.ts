import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentLoadGuard } from './guard/student-load.guard';
import { AdminLoadGuard } from './guard/admin-load.guard';

const routes: Routes = [
  {path:'',loadChildren:()=>import('./pages/student/student.module').then(m=>m.StudentModule),canLoad: [StudentLoadGuard],},
  {path:'admin',loadChildren:()=>import('./pages/admin/admin.module').then(m=>m.AdminModule),canLoad: [AdminLoadGuard],}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
