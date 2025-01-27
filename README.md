 ## Project Overview
This project is a web application that integrates various Google services such as Google OAuth to authenticate users, retrieve specific content based on user attributes, and generate new, dynamic content using AI capabilities. The application is designed to offer personalized content experiences by determining the user's age and providing suitable Google documents accordingly. Here’s how it works:
### User Authentication: 
Users log in to the application using their Google account. This process is seamless and secure, leveraging Google’s OAuth authentication system.


### Age-Based Content Delivery:
Once authenticated, the application fetches the user's birthdate from their Google profile using the Google People API. Based on the user's age, the application differentiates between child and adult users.
#### Child Users:
Users under the age of 13 are classified as children. Due to privacy restrictions, the birth year might not be available, so the application uses the absence of this data to identify child users.
#### Adult Users: 
Users aged 13 and above are classified as adults. The application can access the full birthdate for these users. This will only work if the user has made the birthdate public for his/her Google account.


### Document Retrieval:
Depending on the user’s classification (child or adult), the application fetches the appropriate document from Google Docs. This is achieved using the Google Drive API to access specific documents stored in the user's Google Drive.


### Content Generation:
The content of the fetched Google Doc is then sent to the Gemini AI API, which generates new, contextually relevant text based on the document’s content. This process involves using state-of-the-art natural language processing to create meaningful and coherent text that enhances the original document.
The frontend of the application, built with React, provides a user-friendly interface for logging in, initiating content generation, and displaying the generated text.
## Key Features
### User Authentication:
Uses Google OAuth to authenticate users.
### Document Retrieval:
Fetches content from appropriate Google Docs based on the
user's age.
### Content Generation: 
Uses the Gemini AI API to generate new text based on the
fetched document content.
### Responsive Frontend:
React-based frontend for user interaction.
## Running the Application
### Backend
#### 1. Install Python Dependencies:
pip install flask flask-cors google-auth google-auth-oauthlib
google-auth-httplib2 google-api-python-client google-generativeai
#### Set Up Service Account:
Download the service account JSON file from Google Cloud Console.
Save it to a secure location, e.g., /path/to/service_account.json.
#### 2. Run the Flask Server:
python server.py
### Frontend
Install Dependencies:
npm install axios react-google-login gapi-script
#### Run the React App
