import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public employees: Employee[] = [];
  public editEmployee: Employee | undefined;
  public deleteEmployee: Employee | undefined;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  public getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      (response: Employee[]) => this.employees = response,
      (error: HttpErrorResponse) => alert(error.message)
    )
  }

  public onOpenModal(mode: string, employee?: Employee) {
    const container = document.querySelector('#main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if(mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal')
    }
    if(mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal')
    }
    if(mode === 'delete') {
      this.deleteEmployee = employee
      button.setAttribute('data-target', '#deleteEmployeeModal')
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddEmployee(addForm: NgForm) {
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        const close = document.querySelector('#add-employee-form') as HTMLButtonElement;
        close.click();
        this.getAllEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => alert(error.message)
    )
  }

  public onUpdateEmployee(employee?: Employee) {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        const close = document.querySelector('#edit-employee-form') as HTMLButtonElement;
        close.click();
        this.getAllEmployees();
      },
      (error: HttpErrorResponse) => alert(error.message)
    );
  }

  public onDeleteEmployee(id?: number) {
    this.employeeService.deleteEmployee(id).subscribe(
      (response: void) => {
        const close = document.querySelector('#delete-employee-form') as HTMLButtonElement;
        close.click();
        this.getAllEmployees();
      },
      (error: HttpErrorResponse) => alert(error.message)
    );
  }

  public searchEmployees(value: string) {
    const results: Employee[] = [];
    this.employees.forEach(employee => {
      if(employee.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(value.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(value.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          results.push(employee)
      }
    });
    this.employees = results;
    if(results.length === 0 || !value) {
      this.getAllEmployees();
    }
  }

}
