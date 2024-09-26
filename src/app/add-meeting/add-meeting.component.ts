import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.css']
})
export class AddMeetingComponent implements OnInit {

  // Object to store form data
  meeting = {
    meetingTopic: '',
    numberOfPeople: 1, // Default to at least 1
    meetingDate: '',
    startTime: ''
  };

  // To store messages to be shown to the user
  message: string = '';

  constructor(
    private http: HttpClient, // For HTTP requests
    private router: Router // To navigate on success
  ) { }

  ngOnInit(): void { }

 // In your AddMeetingComponent
onSubmit() {

  // Validate fields
  if (!this.meeting.meetingTopic || this.meeting.numberOfPeople<=0 ||!this.meeting.meetingDate ||!this.meeting.startTime ) {
    this.message = 'All fields are required!';
    return;
}

//Meeting Details For Submission
  const meetingDetails = {
      meetingTopic: this.meeting.meetingTopic,
      numberOfPeople: this.meeting.numberOfPeople,
      meetingDate: this.meeting.meetingDate,
      startTime: this.meeting.startTime
  };

  console.log('Submitting Meeting Details:', meetingDetails); // Log to check values

  

  // POST request to save meeting details
  this.http.post('http://localhost:3000/addMeetings', meetingDetails).subscribe(
      (response: any) => {
          this.message = 'Meeting scheduled successfully!';
          this.router.navigate(['/viewMeeting']); // Redirect to the meetings page
      },
      (error) => {
          console.error('Error scheduling the meeting', error);
          this.message = 'Error scheduling the meeting';
      }
  );
}
}
