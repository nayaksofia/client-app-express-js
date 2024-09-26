import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.css']
})
export class EditMeetingComponent implements OnInit {

  meeting: any = {}; //To store meeting data
  message: string = ''; //To store messages
  meetingId: number = 0; // Store the meeting Id from the route

  constructor(
    private http: HttpClient, // For HTTP requests
    private route: ActivatedRoute,
    private router: Router // To navigate on success
  ) {
    //Extract client ID from URL 
    const idFromMRoute = this.route.snapshot.paramMap.get('id');
    //convert id to number, defalut 0  if invalid . 
    this.meetingId = idFromMRoute ? +idFromMRoute : 0;
  }

  ngOnInit(): void {
    if (this.meetingId) {
      this.fetchMeetingDetails();
    } else {
      this.message = 'Meeting ID not found in the URL.';
    }
  }

  // Fetch meeting details
  fetchMeetingDetails() {

    if (this.meetingId > 0) {
      this.http.get(`http://localhost:3000/meetings/${this.meetingId}`).subscribe(
        (response: any) => {
          if (response) {
            this.meeting = response;  // Assign the fetched meeting data
          } else {
            this.message = 'Meeting not found!';
          }
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching meeting schedules', error);
          if (error.status === 404) {
            this.message = 'Meeting not found. Please check the Meeting ID.';
          } else {
            this.message = 'An error occurred while fetching the meeting schedule.';
          }
        }
      );
    }else{
      this.message = "Invalid Meeting ID";
    }
  }

  // Submit updated meeting details
  onSubmit() {

    // Validate fields
    if (!this.meeting.meetingTopic || this.meeting.numberOfPeople <= 0 || !this.meeting.meetingDate || !this.meeting.startTime) {
      this.message = 'All fields are required!';
      return;
    }

    const meetingDetails = {
      id: this.meetingId,
      meetingTopic: this.meeting.meetingTopic,
      numberOfPeople: this.meeting.numberOfPeople,
      meetingDate: this.meeting.meetingDate,
      startTime: this.meeting.startTime
    };



    // PUT request to update meeting details
    this.http.put(`http://localhost:3000/updateMeeting/${this.meetingId}`, meetingDetails).subscribe(
      (response: any) => {
        this.message = 'Meeting updated successfully!';
        this.router.navigate(['/viewMeeting']); // Redirect to the meetings page
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating the meeting', error);
        this.message = 'Error updating the meeting';
      }
    );
  }
}
