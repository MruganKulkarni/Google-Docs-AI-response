from flask import Flask, jsonify, request
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from google.oauth2 import service_account
from googleapiclient.discovery import build
import google.auth.transport.requests
import google.generativeai as genai
import datetime

# app instance
app = Flask(__name__)
CORS(app)

# Constants
SERVICE_ACCOUNT_FILE = '/Users/mrugankulkarni/Downloads/geminiapi-424910-f463d775479a.json'
API_KEY = 'AIzaSyBbTpUdHOksGCDJsh_sxdW90BoiNrqW8Qw'
CHILD_DOCUMENT_ID = '117Jo05wTThpiRuwVhb1_WecDiCrZR4mcNIiBQn1qiFQ'
ADULT_DOCUMENT_ID = '19nyigkJO4FA1Fk08I2tH3YZU6K6wgsqKOxh9gFNIK8c'

# Helper function to read Google Doc content
def read_google_doc(service_account_file, document_id):
    credentials = service_account.Credentials.from_service_account_file(service_account_file, scopes=['https://www.googleapis.com/auth/drive.readonly'])
    service = build('drive', 'v3', credentials=credentials)

    request = service.files().export_media(fileId=document_id, mimeType='text/plain')
    content = request.execute()

    return content

# Helper function to generate text using the Gemini API
def generate_text(prompt):
    # bytes to string
    prompt_text = prompt.decode('utf-8')

    # Configure the Gemini API with your API key
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Generate text based on the prompt
    response = model.generate_content(prompt_text)
    return response.text

# Helper function to get user info
def get_user_info(access_token):
    creds = Credentials(token=access_token)
    people_service = build('people', 'v1', credentials=creds)

    user_profile = people_service.people().get(
        resourceName='people/me',
        personFields='birthdays'
    ).execute()

    return user_profile

@app.route("/api/home", methods=['GET'])
def return_home():
    document_id = request.args.get('document_id')
    if not document_id:
        return jsonify({'error': 'Missing document_id parameter'}), 400

    try:
        # Read the content of the Google Doc
        doc_content = read_google_doc(SERVICE_ACCOUNT_FILE, document_id)

        # Generate text based on the content of the Google Doc
        generated_text = generate_text(doc_content)

        return jsonify({
            'generated_text': generated_text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/get_document", methods=['GET'])
def get_document():
    access_token = request.args.get('access_token')
    if not access_token:
        return jsonify({'error': 'Missing access_token parameter'}), 400

    try:
        user_info = get_user_info(access_token)
        birthdate_info = user_info.get('birthdays', [])
        birthdate = {}

        if birthdate_info:
            birthdate = birthdate_info[0].get('date', {})
            year = birthdate.get('year')
            month = birthdate.get('month')
            day = birthdate.get('day')
            if year:
                age = datetime.datetime.now().year - int(year)  # Calculate the age
                if age < 13:
                    document_id = CHILD_DOCUMENT_ID
                else:
                    document_id = ADULT_DOCUMENT_ID
            else:
                # Handle the case where the year is missing
                print("Year of birth is missing for this user.")
                document_id = CHILD_DOCUMENT_ID
        else:
            document_id = ADULT_DOCUMENT_ID

        return jsonify({'document_id': document_id, 'birthdate': birthdate})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
