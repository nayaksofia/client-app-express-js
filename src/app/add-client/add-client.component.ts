import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router'; //import 
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css'
})
export class AddClientComponent implements OnInit {
  registrationForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router, private location: Location) {

    //Initialize form group with validation
    this.registrationForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repeatPassword: new FormControl('', Validators.required),
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const repeatPassword = formGroup.get('repeatPassword')?.value;

    // If passwords match, return null, else return mismatch error
    return password === repeatPassword ? null : { mismatch: true };
  }
  ngOnInit(): void {

  }



  //Handle form submission 
  onSubmit() {
    if (this.registrationForm.valid) {

      this.successMessage = null;
      this.errorMessage = null;

      //Send form data to backend -> localhost 3000
      this.http.post('http://localhost:3000/addClient', this.registrationForm.value)
        .subscribe(
          (response: any) => {
            this.successMessage = response.message;

            // Refresh the page after a short delay
            setTimeout(() => {
              this.refreshPage();
            }, 1000); // Delay to show success message for 1 second

          },
          (error : any) => {
            if(error.status === 400){
              this.errorMessage = error.error.error; //Show duplicate email error message
            }else{
              this.errorMessage = "Registration failed. Please try again."
            }
          }
        );
    } else {
      this.errorMessage = "Please fill in all the required fields correctly.";
    }
  }

  //Option-1: Refresh the page after successful registration 
  refreshPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/addClient']);
    });
  }

  
 //Option-2: Refresh automatically after registration is successful.

  // refreshPage() {
  //   window.location.reload();
  // }


}

