import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentLoadGuard } from './guard/student-load.guard';
import { NotfoundComponent } from './pages/errors/notfound/notfound.component';
import { InternalserverComponent } from './pages/errors/internalserver/internalserver.component';
import { BadgatewayComponent } from './pages/errors/badgateway/badgateway.component';
import { BadrequestComponent } from './pages/errors/badrequest/badrequest.component';


const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/student/student.module').then(m => m.StudentModule) },
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule), canLoad: [StudentLoadGuard] },
  { path: 'tutor', loadChildren: () => import('./pages/tutor/tutor.module').then(m => m.TutorModule), canLoad: [StudentLoadGuard]  },
  { path: '400', component: BadrequestComponent },
  { path: '404', component: NotfoundComponent },
  { path: '502', component: BadgatewayComponent },
  { path: '500', component: InternalserverComponent },
  { path: 'error', component: BadrequestComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
