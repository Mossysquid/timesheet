import { Router } from '@angular/router';
import { Department } from '../../interfaces/department';
import { DepartmentsService } from './../../services/departments.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent implements OnInit{
//  departments: Department[] | undefined;
 $departments: Observable<Department[]> | undefined;
    constructor(
      private departmentsService: DepartmentsService,
      private router: Router
    ){}
    ngOnInit(): void {
      //subscribe to the observable
    //   this.departmentsService.getDepartments().subscribe(departments => {
    //     this.departments = departments;
    // });
    this.$departments = this.departmentsService.getDepartments();
    
    
    }
    goToDepartment(departmentId: string): void {
      this.router.navigate(['./timesheet', {id: departmentId}]);
  }
}
