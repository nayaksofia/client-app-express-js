import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent implements OnInit {

  client: any = {}; //To store client data
  message: string = ''; //To store success/error messages 
  clientId: number = 0; //To store the client ID 

  constructor(
    private route: ActivatedRoute,  // Used to get the ID from the route
    private http: HttpClient,
    private router: Router  //Used to navigate after successful edit 
  ) {
    //Extract client ID from URL 
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    //convert id to number, defalut 0  if invalid . 
    this.clientId = idFromRoute ? +idFromRoute : 0;
  }

  ngOnInit(): void {
    this.getClientData();
  }

  //Fetch the client data based on the ID
  getClientData() {
    if (this.clientId > 0) {  //only fetch if clientId is valid 

      this.http.get(`http://localhost:3000/getClient/${this.clientId}`).subscribe(
        (response: any) => {
          this.client = response;
        },
        (error) => {
          console.error('Error fetching client data', error);
          this.message = 'Error fetching client deatials';
        }
      );
    } else {
      this.message = "Invalid  client ID ";
    }
  }


  onSubmit() {
    // Check if the password fields are empty
    if (!this.client.Password || !this.client.RepeatPassword) {
      this.message = 'Password and Repeat Password cannot be null or empty';
      return; // Stop execution if validation fails
    }
  
    // Ensure both password and repeatPassword match
    if (this.client.Password !== this.client.RepeatPassword) {
      this.message = 'Password and Repeat Password must match';
      return; // Stop execution if they don't match
    }
  
    // Proceed with HTTP PUT request for updating client data
    const updatedClient = {
      id: this.clientId,
      name: this.client.Name,
      email: this.client.Email,
      address: this.client.Address,
      password: this.client.Password,
      repeatPassword: this.client.RepeatPassword
    };
  
    this.http.put(`http://localhost:3000/updateClient/${this.clientId}`, updatedClient)
      .subscribe((response: any) => {
        this.message = 'Client updated successfully!';
        this.router.navigate(['/viewClient']); // Redirect after successful update
      }, error => {
        console.error('Error updating client information', error);
        this.message = 'Error updating client information';
      });
  }

}


