from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import openai
from dotenv import load_dotenv
# from chunking import chunkify
# from whisper.utils import get_writer
import whisper

PORT = 8000
# dir for storing uploaded audio files temporarily
UPLOAD_DIRNAME = '__uploads'
UPLOAD_FILENAME = 'new_audio_upload.webm'
SAMPLE_PROMPT = ("ZenithNex, SonicBlast X, DynaPulse Max, CyberLink X7, "
                 "Vectronix V9, NebulaLink Alpha, QuantumPulse Matrix, "
                 "FUZION, RAZE, BOLT, QUBE, and FLARE")
# for convenient copy and paste during testing with en-complex.wav.
# not actually used here

app = Flask(__name__)
CORS(app)

load_dotenv()
openai.openai_api_key = os.getenv("OPENAI_API_KEY")


# print(openai.openai_api_key)


def transcribe_using_local_whisper(input_filepath, prompt):
    # Models
    MODEL_TINY = 'tiny'
    # MODEL_TINY_EN = 'tiny.en'
    # MODEL_BASE = 'base'
    # MODEL_BASE_EN = 'base.en'

    # load model
    model = whisper.load_model(MODEL_TINY)

    # default
    my_options = {
        # 'language': 'en',
        'audio': input_filepath,
        'temperature': 0.0,
        'word_timestamps': True,
        'verbose': True,
    }

    # add prompt if included
    if prompt:
        my_options['initial_prompt'] = prompt

    print("SELECTED OPTIONS: ", my_options)

    result = model.transcribe(**my_options)
    print("Finished transcribing locally!")

    # print(result)

    return result['text']


def transcribe_using_api(filepath, *args, **kwargs):
    try:
        audio_file = open(filepath, "rb")

        # default options
        my_options = {
            'model': "whisper-1",
            'file': audio_file,
            'language': 'en',
            'response_format': 'json',
            'temperature': 0
        }

        # update options acc to params
        if 'language' in kwargs:
            my_options['language'] = kwargs['language']
        if 'prompt' in kwargs:
            my_options['prompt'] = kwargs['prompt']
        if 'response_format' in kwargs:
            my_options['response_format'] = kwargs['response_format']
        if 'temperature' in kwargs:
            my_options['temperature'] = kwargs['temperature']

        print("SELECTED OPTIONS: ", my_options)

        # request transcription
        response = openai.audio.transcriptions.create(**my_options)

        # EXPLANATION OF PARAMS (see full list here:
        # https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)

        print("Finished transcribing using api!")

        # Return the response
        if my_options['response_format'] == 'text':
            return response

        # print('RESPONSE:\n', response, '\n')
        print('RESPONSE TEXT:\n', response.text, '\n')
        return response.text

    except FileNotFoundError:
        print("File not found.")

    except Exception as e:
        print("An error occurred:", e)

def generate_tags(text):
    try:
        stream = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": f"""Extract key concepts
            from the following text as a comma-separated list of tags(limit it
            to 3 tags), make sure the tags highlight the true essence of the
            text. The tags can be a single word, or two or three words
            separated by hyphen if and only if they are needed:{text}"""}],
            stream=False,
            max_tokens=100,
            temperature=0.5
        )
        return jsonify({"tags": stream.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# All requests end up here eventually:
def get_notes_on_text(text):
    options = {
        'format': 'bullet',
        'headings': True,
        'detail': 'high',
        'organization': 'chronological',
    }

    system_prompt = create_system_prompt_for_note_gen(options)

    print(system_prompt)
    note = request_notes_from_chat_api(0, system_prompt, text)
    return note


def create_system_prompt_for_note_gen(options):
    """
    Creates and returns a system prompt string based on
    the contents of the given 'options'.

    Args:
        options: A dictionary representing user-selected options for
        note
            'format'            'bullet', 'paragraph'
            'headings'          True, False
            'detail'            'high', 'medium', 'low'
            'organization'      'chronological', 'topic'

    Returns:
        system_prompt: a system prompt string reflecting user options

    """
    system_prompt = ('Your task is to generate notes from the transcribed '
                     'text, adhering to the following guidelines: The notes '
                     'should focus solely on the content itself, omitting '
                     ' any references to the lecture or the speaker. '
                     )

    # format ('bullet' / 'plain')
    if options['format'] == 'bullet':
        system_prompt += 'Generate notes in bullet-point format. '
    else:
        system_prompt += ('Generate notes in paragraph-form with full '
                          'sentences, rather than bullet-points. ')

    # headings (True / False) -- if "format" is 'paragraph', "headings"
    # should be FALSE
    if options['headings'] is True:
        system_prompt += ('Organize the notes with headings and / or '
                          'subheadings. ')
    else:
        system_prompt += ('Organize the notes without headings and / or '
                          'subheadings. ')

    # detail-level? ('detailed' / 'ßmedium' / 'brief')
    if options['detail'] == 'high':
        system_prompt += ('The detail level should be high '
                          'Include all relevant points and examples. ')
    elif options['detail'] == 'medium':
        system_prompt += ('The detail level should be medium '
                          'Summarize key points, omitting some details. ')
    elif options['detail'] == 'low':
        system_prompt += ('The detail level should be low '
                          'Capture only the main ideas and key concepts. ')

    # organization? ('chronological' / 'topic')
    if options['organization'] == 'chronological':
        system_prompt += 'Arrange notes in the order they appear in the text. '
    else:
        system_prompt += 'Arrange notes based on topics or themes. '

    # print("SYSTEM PROMPT: ", system_prompt, '\n')
    return system_prompt


def request_notes_from_chat_api(temperature, system_prompt, transcript):
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            temperature=temperature,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": transcript  # string
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        print("An error occurred:", e)


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


def process_audio_request():
    ALLOWED_MIMETYPES = {'video/webm', 'video/mp4',
                         'audio/mpeg', 'audio/mp3', 'audio/wav'}
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), None
    file = request.files['file']
    keywords = request.form.get('keywords')
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), None
    if file.mimetype not in ALLOWED_MIMETYPES:
        return jsonify({'error': 'Invalid file type'}), None
    return file, keywords


@ app.route('/api/uploadAudio', methods=['POST'])
def handle_audio_upload():

    try:
        file, keywords = process_audio_request()
        print(file.filename, keywords)

        # Get the path to the directory where the script is located
        script_dir = os.path.dirname(__file__)

        # Construct the file path using the appropriate separator
        # for the current platform
        upload_filepath = os.path.join(
            script_dir, UPLOAD_DIRNAME, UPLOAD_FILENAME)
        print("UPLOAD_FILEPATH: ", upload_filepath, '\n')

        upload_dir = os.path.join(script_dir, UPLOAD_DIRNAME)

        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # Save the file
        file.save(upload_filepath)

        # Determine file size to see if it needs to be chunked first
        file_size = os.path.getsize(upload_filepath)
        print("file size :", file_size, "bytes")

        transcript = ''

        # GENERATE TRANSCRIPTION OF AUDIO FILE
        # Chunking needed
        if file_size > 24000000:

            print(
                "RECEIVED FILE OVER 24000000 bytes"
                " -- TRANSCRIBING VIA **LOCAL WHISPER**")

            transcript = transcribe_using_local_whisper(
                upload_filepath, keywords)

            note = get_notes_on_text(transcript)

            print(note)
            return ('', 200)

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

    except Exception as e:
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500


@ app.route('/api/uploadText', methods=['POST'])
def handle_text_upload():

    # ALLOWED_MIMETYPES = {'text/plain'}

    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})
        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        # if file.mimetype not in ALLOWED_MIMETYPES:
        #     print(file.mimetype)
        #     return jsonify({'error': 'Invalid file type'})

        try:
            # Read the content of the file
            file_content = file.read().decode('utf-8')
        except UnicodeDecodeError as e:
            return f'Error decoding file content: {e}'

        # print("File content:")
        # print(type(file_content))
        # print("UPLOADED TEXT: ", file_content)

        note = get_notes_on_text(file_content)
        print(note)

        return jsonify(
            {
                'message': 'Successfully got a response',
                'note': note
            }
        )

    except Exception as e:
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

@app.route('/api/generateTags', methods=['POST'])
def handle_generate_tags():
    try:
        data = request.get_json()
        text = data.get('text')
        if not text:
            return jsonify({'error': 'No text provided'}), 400

        tags = generate_tags(text)
        return tags
    except Exception as e:
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
