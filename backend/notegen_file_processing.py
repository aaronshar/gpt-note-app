# Author: Sayhee Kim

import os
import filetype
from flask import request
import datetime
from notegen_errors import (UnrecognizableFiletypeException,
                            InvalidFiletypeException,
                            TextFileProcessingError
                            )

ALLOWED_AUDIO_MIMETYPES = [
    'audio/mpeg',  # mp3
    'video/mp4',   # mp4
    'video/mpeg',  # mpeg, mpga
    'audio/mp4',   # m4a
    'audio/x-wav',  # wav
    'video/webm',  # webm
]


# Returns the text inside the text file of request.
# Raises TextFileProcessingError if it doesn't look like a text file
def process_text_file(text_file):
    try:
        # List of common text encodings to try
        text_encodings = ['utf-8']  # Add more as needed

        # Read the entire file contents
        data = text_file.read()

        # Try to decode the file contents using different text encodings
        for encoding in text_encodings:
            decoded_text = data.decode(encoding)
            # If decoding succeeds without errors, consider it a text file
            print(decoded_text)
            return decoded_text

    except Exception as e:
        # None of the encodings succeeded, so it's likely not a text file
        print("ERROR:", e)
        print("Probably not a text file")
        raise TextFileProcessingError()


def delete_files_in_folder(folder_path):
    # Check if the folder exists
    if not os.path.exists(folder_path):
        print(f"Folder '{folder_path}' does not exist.")
        return
    # Iterate over all files in the folder
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        # Check if it's a file (not a directory)
        if os.path.isfile(file_path):
            # Delete the file
            os.remove(file_path)


# Does some initial 'processing' of audio file sent in request to
# make sure it is acceptable
# Raises exceptions if they occur.
# If all successful, returns the file itself
def process_audio_request():
    # Error - no audio file was included in request
    if 'file' not in request.files:
        raise ValueError('No file part')

    file = request.files['file']
    guess = filetype.guess(file)

    if guess is None:
        raise UnrecognizableFiletypeException()

    mimetype = guess.mime
    if mimetype not in ALLOWED_AUDIO_MIMETYPES:
        raise InvalidFiletypeException()

    return file


# Helper to generate unique filename for audio uploads
def get_unique_filename(original_filename):
    # Get the current date and time
    current_time = datetime.datetime.now()
    # Format the date and time to create a unique string
    formatted_time = current_time.strftime('%Y%m%d_%H%M%S')
    # Get the file extension
    _, file_extension = os.path.splitext(original_filename)
    # Combine the formatted time and file extension to create a
    # unique file name
    unique_filename = f"upload_{formatted_time}{file_extension}"

    return unique_filename
