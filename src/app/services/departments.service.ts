import { Injectable } from '@angular/core';
import { Department } from '../interfaces/department';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
//injecting things
  constructor(
    private http: HttpClient
  ) { };
  getDepartments(): Observable<Department[]> {

    // refrencing the http depencincy that was injected into the constructor
    return this.http.get<Department[]>(`https://hr-timesheet-test.firebaseio.com/departments.json`);
}
}
