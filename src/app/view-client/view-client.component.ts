import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //To fetch user data 
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {

  clients: any[] = [];  //To store client data
  message: string = '';  //To display message

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchClientsInformation();
  }

  //fetch all client information from backend
  fetchClientsInformation() {    //getClients : backendAPI 
    this.http.get('http://localhost:3000/getClients').subscribe(
      (response: any) => {
        if (response.length > 0) {
          this.clients = response;
          this.message = 'Clients fetched successfully!';
        } else {
          this.message = 'No clients found in the database.';
        }
      },
      (error) => {
        console.error('Error fetching the client information', error);
        this.message = 'Error fetching the client information';
      }
    );
  }


  //Delete client by ID With confirmation pupup 
  deleteClient(id: number) {
    //Show confirmation dialog 
    if (confirm('Are you sure you want to delete this client?')) {

      const deleteUrl = `http://localhost:3000/deleteClient/${id}`;  // API endpoint to delete the client

      this.http.delete(deleteUrl).subscribe(
        (response) => {
          this.message = `Client with ID: ${id} has been deleted successfully.`;
          this.clients = this.clients.filter(client => client.ID !== id); // Remove the deleted client from the local array

        },
        (error) => {
          console.error('Error deleting the Client', error);
          this.message = 'Error deleting client';
        }
      );

    }
  }
}


