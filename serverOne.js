//let's define : dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

//let's define : express operations
const app = express();  //express is initiated 

//let's define : port
const port = 3000;

//defining the cors- cross origin by receiving the data in json format
app.use(cors()); //Enable CORS
app.use(bodyParser.json())  //Parse JSON Bodies

//Establish MySQL Connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'client_db'
    }
);

//Verifying whether DB is connected or not 

db.connect(err => {
    if (err) {
        console.log('Connection is not established with the db', err);
    } else {
        console.log('Connection established with db succesfully');
    }
});

//Start Server :: On what port number having this application
app.listen(port, () => {
    console.log(`Server port established on port ${port}`)
})



//********************************************************************/
// ------------------Define API For Table : ClientInformation-------------------/
//*******************************************************************/ 

//1. Define API : Insert Data In Client Information Table 
app.post('/addClient', (req, res) => {

    //Extract Client Information From Request Body
    const { name, email, address, password, repeatPassword } = req.body;

    //Check if the email already exists in the database
    const checkEmailSql = 'SELECT * FROM ClientInformation WHERE Email = ?';

    db.query(checkEmailSql, [email], (err, result) => {

        if (err) {
            console.error('Error in checking email existence', err);
            return res.status(500).json({ error: 'An error occurred while checking email' });
        }

        if (result.length > 0) {
            //If email already exists
            return res.status(400).json({ error: 'Email already exists. Please use a different email.' })
        }

        //If email does not exist, proceed with the insert 
        //Write SQL Query
        const insertSql = 'INSERT INTO ClientInformation (Name, Email,Address , Password, RepeatPassword) VALUES(?, ?, ?, ?, ?)';

        db.query(insertSql, [name, email, address, password, repeatPassword], (err, result) => {
            if (err) {
                console.error('Error in inserting client information', err);
                res.status(500).json({ error: 'An error occurred while inserting client information.' });
            } else {
                res.status(200).json({ message: 'Client Registered Successfully' });
            }
        });

    });

});

//2. Define API For View Data (all)
app.get('/getClients', (req, res) => {

    // Write SQL Query
    const sql = 'SELECT * FROM ClientInformation';

    // Connect database and call the query method
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error in fetching the client information', err);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.status(200).json(result);
        }
    });
});

//3. Get Client By Id: Define API For View Data By Id

app.get('/getClient/:id', (req, res) => {

    const id = req.params.id;
    const sql = 'SELECT * FROM ClientInformation WHERE id = ?';

    // Connect database and call the query method
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error in fetching the client information by ID', err.message);
            res.status(500).json({ error: 'An error occurred while fetching the client information.' });
        } else if (result.length === 0) {
            res.status(404).json({ error: 'Client not found' });
        } else {
            res.status(200).json(result[0]); //Return the first (and expected only) result
        }
    });
});

//4. Updating Specific Client Information  [app.put]

// Assuming you have an Express route to handle the update request
app.put('/updateClient/:id', (req, res) => {

    const clientId = req.params.id;
    const { name, email, address, password, repeatPassword } = req.body;

    // Make sure all fields are properly validated and not null
    if (!name || !email || !password || !repeatPassword) {
        return res.status(400).json({ message: 'Fields cannot be null' });
    }

    // SQL query to update the client info
    const sql = `UPDATE ClientInformation
                 SET Name = ?, Email = ?, Address = ?, Password = ?, RepeatPassword = ?
                 WHERE ID = ?`;

    //Update the client based on the provided ID
    db.query(sql, [name, email, address, password, repeatPassword, clientId], (err, result) => {
        if (err) {
            console.error('Error updating client information', err);
            return res.status(500).json({ message: 'Error updating client information' });
        }

        // If no rows were affected, the ID was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Successfully updated
        res.json({ message: 'Client updated successfully' });
    });
});


//5. Deleting Client Information By Id [app.delete]
app.delete('/deleteClient/:id', (req, res) => {
    const id = req.params.id;
    const sql = " DELETE FROM ClientInformation WHERE id = ? ";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.err('Error in deleting the client by id', err);
        } else {
            res.status(200).json({ message: 'Client Deleted Successfully' })
        }
    });
});



//********************************************************************/
// ------------------Define API For Table : Meeting Schedule-------------
//Column Name: ID,MeetingTopic,NumberOfPeople,MeetingDate,StartTime/
//*******************************************************************/



//1.Insert Meeting Schedule [app.post]
app.post('/addMeetings', (req, res) => {
    
    const { meetingTopic, numberOfPeople, meetingDate, startTime } = req.body;

    if (!meetingTopic || !numberOfPeople || !meetingDate || !startTime) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const sql = 'INSERT INTO MeetingSchedule (MeetingTopic, NumberOfPeople, MeetingDate, StartTime) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [meetingTopic, numberOfPeople, meetingDate, startTime], (err, result) => {
        if (err) {
            console.error('Error inserting meeting data', err);
            return res.status(500).json({ message: 'Failed to schedule the meeting' });
        }
        res.status(200).json({ message: 'Meeting scheduled successfully!' });
    });
});


//2. Get All Meeting Schedules
app.get('/meetings', (req, res) => {

    // SQL query to fetch all records from MeetingSchedule table
    const sql = 'SELECT * FROM MeetingSchedule';

    // Execute the SQL query
    db.query(sql, (err, result) => {

        // Handle any database errors
        if (err) {
            console.error('Error fetching the meeting schedules', err);
            // Respond with 500 status if there's a server-side error
            return res.status(500).json({ error: 'An error occurred while fetching meeting schedules.' });
        }

        // Check if there are any results
        if (result.length === 0) {
            return res.status(404).json({ message: 'No meetings found.' });
        }

        // Send back the result if the query is successful
        res.status(200).json(result);
    });
});

//3. Get Meeting by ID
app.get('/meetings/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM MeetingSchedule WHERE ID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching the meeting', err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.status(200).json(result[0]);
    });
});






//4. Update Meeting Schedule by ID
app.put('/updateMeeting/:id', (req, res) => {
    const { id } = req.params;
    const { meetingTopic, numberOfPeople, meetingDate, startTime } = req.body;

    // Validate that all fields are present
    if (!meetingTopic || !numberOfPeople || !meetingDate || !startTime) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // SQL query to update the meeting
    const sql = 'UPDATE MeetingSchedule SET MeetingTopic = ?, NumberOfPeople = ?, MeetingDate = ?, StartTime = ? WHERE ID = ?';

    // Execute the query with the provided data
    db.query(sql, [meetingTopic, numberOfPeople, meetingDate, startTime, id], (err, result) => {
        if (err) {
            console.error('Error updating the meeting', err);
            return res.status(500).json({ message: 'Failed to update the meeting' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Meeting not found!' });
        }

        res.status(200).json({ message: 'Meeting updated successfully!' });
    });
});

//5. Delete Meeting Schedule [app.delete]
app.delete('/deleteMeeting/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM MeetingSchedule where id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error in deleting the meeting schedule by id', err); // Fix: Use console.error, not console.err
            return res.status(500).json({ error: 'An error occurred while deleting the meeting' });
        }
        res.status(200).json({ message: 'Meeting deleted successfully!' }); // Send proper response after deletion
    });
})