import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { HttpClientModule } from '@angular/common/http';


const adminRoute: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: '', component: AdminLoginComponent },
    ]
  }]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(adminRoute),
    CommonModule,
    HttpClientModule
  ],
  exports: [
    RouterModule
  ]
})
export class AdminModule { }
