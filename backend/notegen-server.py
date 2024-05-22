from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import openai
from dotenv import load_dotenv

from notegen_and_transcription import (
    transcribe_using_local_whisper,
    transcribe_using_api,
    get_notes_on_text
)

from notegen_file_processing import (
    process_audio_request,
    process_text_file,
    delete_files_in_folder,
    get_unique_filename
)

from notegen_errors import (
    InvalidFiletypeException,
    TextFileProcessingError,
    UnrecognizableFiletypeException,
    TranscriptionError,
    NoteGenerationError
)

PORT = 8000
# dir for storing uploaded audio file temporarily
UPLOAD_DIRNAME = '__uploads'

UPLOAD_FILENAME = 'new_audio_upload.webm'

SAMPLE_PROMPT = ("ZenithNex, SonicBlast X, DynaPulse Max, CyberLink X7, "
                 "Vectronix V9, NebulaLink Alpha, QuantumPulse Matrix, "
                 "FUZION, RAZE, BOLT, QUBE, and FLARE")
# for convenient copy and paste during testing with en-complex.wav.
# not actually used here

# these are mimetypes returned by 'filetype' library
# that correlate to the file formats accepted by OpenAI
# (namely mp3, mp4, mpeg, mpga, m4a, wav, and webm.)
# https://platform.openai.com/docs/guides/speech-to-text
# https://help.openai.com/en/articles/7031512-whisper-audio-api-faq
ALLOWED_AUDIO_MIMETYPES = [
    'audio/mpeg',  # mp3
    'video/mp4',  # mp4
    'video/mpeg',  # mpeg, mpga
    'audio/mp4',  # m4a
    'audio/x-wav',  # wav
    'video/webm',  # webm
]

app = Flask(__name__)
CORS(app)

load_dotenv()
openai.openai_api_key = os.getenv("OPENAI_API_KEY")
# print(openai.openai_api_key)


@ app.route('/api/uploadAudio', methods=['POST'])
# flake8: noqa: C901
def handle_audio_upload():

    try:
        file = process_audio_request()  # will raise errors if any
        # Get the path to the directory where the script is located
        script_dir = os.path.dirname(__file__)

        # Construct the file path using the appropriate separator
        # for the current platform
        upload_filename = get_unique_filename(file.filename)
        upload_filepath = os.path.join(
            script_dir, UPLOAD_DIRNAME, upload_filename)
        print("UPLOAD_FILEPATH: ", upload_filepath, '\n')

        # Construct the directory path using the appropriate separator
        # for the current platform
        upload_dir = os.path.join(script_dir, UPLOAD_DIRNAME)

        # Create upload directory if it doesn't already exist
        # (to prevent error)
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # Save the file
        file.save(upload_filepath)

        # Determine file size
        file_size = os.path.getsize(upload_filepath)
        print("file size :", file_size, "bytes")

        transcript = ''

        keywords = request.form.get('keywords')

        # GENERATE TRANSCRIPTION OF AUDIO FILE
        if file_size > 24000000:
            print(
                "RECEIVED FILE OVER 24000000 bytes"
                " -- TRANSCRIBING VIA **LOCAL WHISPER**")

            # get keywords string from request

            # Get transcript using local whisper
            transcript = transcribe_using_local_whisper(
                upload_filepath, keywords)

            # Get notes from transcript
            note = get_notes_on_text(transcript)

            print(note)
            return jsonify(
                {
                    'message': 'Successfully got a response',
                    'transcript': transcript,
                    'note': note
                }
            )

        else:
            print("RECEIVED FILE UNDER 24000000 bytes"
                  "-- TRANSCRIBING VIA **API**")
            if keywords:
                transcript = transcribe_using_api(
                    upload_filepath, prompt=keywords)
            else:
                transcript = transcribe_using_api(
                    upload_filepath)

            # print("TRANSCRIPT: ", transcript, "\n")

            note = get_notes_on_text(transcript)

            # cleanup
            delete_files_in_folder(UPLOAD_DIRNAME)

            return jsonify(
                {
                    'message': 'Successfully got a response',
                    'transcript': transcript,
                    'note': note
                }
            )

    except ValueError as e:
        return jsonify({'error': f"{e}"}), 400

    except UnrecognizableFiletypeException as e:
        return jsonify({'error': f"{e}"}), 400

    except InvalidFiletypeException as e:
        return jsonify({'error': f"{e}"}), 400

    except TranscriptionError as e:
        return jsonify({'error': f"{e}"}), 400

    except NoteGenerationError as e:
        return jsonify({'error': f"{e}"}), 400

    except Exception as e:
        return jsonify({'error': f"{e}"}), 500


@ app.route('/api/uploadText', methods=['POST'])
def handle_text_upload():
    try:
        if 'file' not in request.files:
            raise ValueError

        # will raise TextFileProcessingError otherwise
        file_content = process_text_file(request.files['file'])

        note = get_notes_on_text(file_content)
        print(note)

        return jsonify(
            {
                'message': 'Successfully got a response',
                'note': note
            }
        )

    except TextFileProcessingError as e:
        return jsonify({'error': f"TextFileProcessingError: {e}"}), 400
    except Exception as e:
        return jsonify({'error': f"{e}"}), 400


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
