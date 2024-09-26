import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-meeting',
  templateUrl: './view-meeting.component.html',
  styleUrls: ['./view-meeting.component.css']
})
export class ViewMeetingComponent implements OnInit {

   // Array to hold the list of meetings
   meetings: any[] = [];
   message: string = '';
 
   constructor(
     private http: HttpClient,
     private router: Router
   ) { }
 
   ngOnInit(): void {
     this.getMeetings(); // Fetch the list of meetings on component initialization
   }
 
   // Fetch all meeting schedules from the backend
   getMeetings(): void {
     this.http.get('http://localhost:3000/meetings').subscribe(
       (response: any) => {
         this.meetings = response; 
       },
       (error) => {
         console.error('Error fetching meeting schedules', error);
         this.message = 'Error fetching meeting schedules';
       }
     );
   }
 
 
   // Delete a meeting by ID
   onDelete(meetingId: number): void {
     if (confirm('Are you sure you want to delete this meeting?')) {
       this.http.delete(`http://localhost:3000/deleteMeeting/${meetingId}`).subscribe(
         (response: any) => {
           this.message = 'Meeting deleted successfully!';
           this.getMeetings(); // Refresh the list after deletion
         },
         (error) => {
           console.error('Error deleting the meeting', error);
           this.message = 'Error deleting the meeting';
         }
       );
     }
   }
}

