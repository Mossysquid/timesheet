import { Department } from './../../interfaces/department';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentsService } from '../../services/departments.service';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Employee } from '../../interfaces/employee';
import { Observable, map, switchMap, tap } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss'
})
export class TimesheetComponent implements OnInit{
  // departments: Department[] | undefined;
  $departments: Observable<Department[]> | undefined;
  department: Department | undefined;
  employeeNameFC = new FormControl('', this.nameValidator());
  employees: Employee[] = [];
employeeId = 0;
weekdays: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

constructor(
  private route: ActivatedRoute,
  private departmentsService: DepartmentsService,
  private employeeService: EmployeeService,
  private router: Router
){
}
ngOnInit(): void {
  //need to first get departments
  this.$departments = this.departmentsService.getDepartments();
  this.$departments.pipe(
    switchMap(departments => {
      this.department = departments.find(dept => dept.id === this.route.snapshot.params['id'])
      return this.employeeService.getEmployeeHoursByDepartment(this.department.id);
    }),
    tap(employees => {
      this.employees = employees;
    })
  ).subscribe();
  // this.$departments = this.departmentsService.getDepartments();
  // this.$departments.pipe(
  //   //mapping over departments to find the department with the id that matches the id in the route with observable
  //     map(departments => departments.find(department => department.id === this.route.snapshot.params['id']))
  //     //subscribing to the department inside the observable
  //  ).subscribe(department => this.department = department);
  //  find(department => department.id === this.route.snapshot.params['id']);
};
addEmployee(): void {
  if (this.employeeNameFC.value) {
     

      this.employees.push({
  
          departmentId: this.department?.id,
          name: this.employeeNameFC.value,
          payRate: Math.floor(Math.random() * 50) + 50,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0
      });

      this.employeeNameFC.setValue('');
  }
};

nameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
      let error = null;
      if (this.employees && this.employees.length) {
          this.employees.forEach(employee => {
              if (employee.name.toLowerCase() === control.value.toLowerCase()) {
                  error = {duplicate: true};
              }
          });
      }
      return error;
  };
};

getTotalHours(employee: Employee): number {
  return employee.monday + employee.tuesday + employee.wednesday
      + employee.thursday + employee.friday + employee.saturday + employee.sunday;
};

deleteEmployee(employee: Employee, index: number): void {
  if (employee.id) {
      this.employeeService.deleteEmployeeHours(employee);
  }

  this.employees.splice(index, 1);
}
submit(): void {
  this.employees.forEach(employee => {
    if (employee.id) {
        this.employeeService.updateEmployeeHours(employee);
    } else {
        this.employeeService.saveEmployeeHours(employee);
    }
});

this.router.navigate(['./departments']);
};

}

  