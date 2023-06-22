import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentLoadGuard } from './guard/student-load.guard';
import { NotfoundComponent } from './pages/errors/notfound/notfound.component';
import { InternalserverComponent } from './pages/errors/internalserver/internalserver.component';
import { BadgatewayComponent } from './pages/errors/badgateway/badgateway.component';


const routes: Routes = [
  {path:'',loadChildren:()=>import('./pages/student/student.module').then(m=>m.StudentModule)},
  {path:'admin',loadChildren:()=>import('./pages/admin/admin.module').then(m=>m.AdminModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
