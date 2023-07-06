import { Component, OnInit } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  t_count!: number;
  s_count!: number;
  c_count!: number;
  orders: any;
  currentPage: number = 0;
  pageSize: number = 5;
  constructor(private authService: AuthService, private adminService: AdminService) { }
  ngOnInit(): void {
    this.adminService.getDashboardCounts().subscribe((res) => {
      if (res.status) {
        this.t_count = parseInt(res.counts.tchr);
        this.c_count = parseInt(res.counts.crs);
        this.s_count = parseInt(res.counts.std);
      }
    }, (error) => {
      this.authService.handleError(error.status)
    })
    this.adminService.getOrders().subscribe((res) => {
      if (res.status) {
        this.orders = res.result
      }
    }, (error) => {
      this.authService.handleError(error.status)
    })
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.pageSize);
  }

  get pagedOrders(): any[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.orders.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

}
