from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import openai
from dotenv import load_dotenv
from chunking import chunkify

PORT = 8000
UPLOAD_DIRNAME = 'uploads'  # dir for storing original audio files (not chunks)
UPLOAD_FILENAME = 'recording.webm'
# dir for storing chunks, if chunking was necessary
CHUNKS_DIRNAME = 'process_chunks'

app = Flask(__name__)
CORS(app)

load_dotenv()
openai.openai_api_key = os.getenv("OPENAI_API_KEY")

# print(openai.openai_api_key)


def generate_transcription(filepath, *args, **kwargs):
    # print("INSIDE GEN")
    try:
        audio_file = open(filepath, "rb")

        # parse for params that were optional
        param_language = (
            kwargs['language']
            if 'language' in kwargs else 'en'
        )
        param_prompt = (
            kwargs['prompt']
            if 'prompt' in kwargs else ''
        )
        param_response_format = (
            kwargs['response_format']
            if 'response_format' in kwargs else 'json'
        )
        param_temperature = (
            kwargs['temperature']
            if 'temperature' in kwargs else 0
        )

        print("PARAM_PROMPT: ", param_prompt)

        # request transcription
        response = openai.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language=param_language,
            prompt=param_prompt,
            response_format=param_response_format,
            temperature=param_temperature
        )

        # EXPLANATION OF PARAMS (see full list here:
        # https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)

        # Return the response

        if param_response_format == 'text':
            return response

        # print('RESPONSE:\n', response, '\n')
        # print('RESPONSE TEXT:\n', response.text, '\n')
        return response.text

    except FileNotFoundError:
        print("File not found.")

    except Exception as e:
        print("An error occurred:", e)


# NOTE GEN ######################################################

def create_system_prompt_for_text_input(options):
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


def generate_note(temperature, system_prompt, original_transcript):
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
                    "content": original_transcript  # string
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


@ app.route('/api/uploadAudio', methods=['POST'])
def get_notes_from_audio():

    ALLOWED_MIMETYPES = {'video/webm', 'video/mp4',
                         'audio/mpeg', 'audio/mp3', 'audio/wav'}

    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})

        file = request.files['file']

        # this field will only exist in the request form if keywords field
        # was entered by user
        keywords = request.form.get('keywords')

        if keywords:
            print("KEYWORDS :", keywords)
        else:
            print("NO KEYWORDS, LAD!")

        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        if file.mimetype not in ALLOWED_MIMETYPES:
            return jsonify({'error': 'Invalid file type'})

        # Get the path to the directory where the script is located
        script_dir = os.path.dirname(__file__)

        # Construct the file path using the appropriate separator
        # for the current platform
        upload_filepath = os.path.join(
            script_dir, UPLOAD_DIRNAME, UPLOAD_FILENAME)
        print("UPLOAD_FILEPATH: ", upload_filepath, '\n')

        # Save the file
        file.save(upload_filepath)

        # Determine file size to see if it needs to be chunked first
        file_size = os.path.getsize(upload_filepath)
        print("file size :", file_size, "bytes")

        transcript = ''

        # GENERATE TRANSCRIPTION OF AUDIO FILE
        # Chunking needed
        if file_size > 24000000:
            print("CHUNKING!")
            total_num_chunks = chunkify(upload_filepath)

            print(total_num_chunks)
            print("total_num_chunks", total_num_chunks)

            # Get transcript for each chunk and concatenate
            for i in range(total_num_chunks):
                chunk_filepath = os.path.join(
                    script_dir, CHUNKS_DIRNAME, f"chunk{i}.wav")
                # print('chunk file path: ', chunk_filepath)
                if keywords:
                    chunk_transcript = generate_transcription(
                        chunk_filepath, prompt=keywords)
                else:
                    chunk_transcript = generate_transcription(
                        chunk_filepath)

                print(f"chunk {i} transcript :", chunk_transcript)
                # Concatenate the transcript text
                transcript += chunk_transcript

        else:
            print("NO NEED FOR CHUNKING!")
            if keywords:
                transcript = generate_transcription(
                    upload_filepath, prompt=keywords)
            else:
                transcript = generate_transcription(
                    upload_filepath)

        # print("TRANSCRIPT: ", transcript, "\n")

        # GENERATE NOTE FROM TRANSCRIPT

        options = {
            'format': 'bullet',
            'headings': True,
            'detail': 'high',
            'organization': 'chronological',
        }

        system_prompt = create_system_prompt_for_text_input(options)
        note = generate_note(0, system_prompt, transcript)

        # cleanup
        delete_files_in_folder('./process_chunks')
        delete_files_in_folder('./uploads')

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
def get_notes_from_text():

    ALLOWED_MIMETYPES = {'text/plain'}

    print("GOT ONE")

    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})
        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        if file.mimetype not in ALLOWED_MIMETYPES:
            return jsonify({'error': 'Invalid file type'})

        try:
            # Read the content of the file
            file_content = file.read().decode('utf-8')
        except UnicodeDecodeError as e:
            return f'Error decoding file content: {e}'

        # print("File content:")
        # print(type(file_content))
        # print(file_content)

        # GENERATE NOTE FROM TEXT

        options = {
            'format': 'bullet',
            'headings': True,
            'detail': 'high',
            'organization': 'chronological',
        }

        system_prompt = create_system_prompt_for_text_input(options)

        print(system_prompt)
        note = generate_note(0, system_prompt, file_content)

        return jsonify(
            {
                'message': 'Successfully got a response',
                'note': note
            }
        )

    except Exception as e:
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)

# old effort: getting notes from a textarea instead of uploading
# @app.route('/api/uploadText', methods=['POST'])
# def get_notes_from_text():

#     try:

#         inputText = request.form.get('inputText')

#         options = {
#             'format': 'bullet',
#             'headings': True,
#             'detail': 'high',
#             'organization': 'chronological',
#         }

#         system_prompt = create_system_prompt_for_text_input(options)
#         note = generate_note(0, system_prompt, inputText)

#         return jsonify(
#             {
#                 'message': 'Successfully got a response',
#                 'note': note
#                 # "message": "message",
#                 # "transcript": "transcript",
#                 # "note": "note",
#             }
#         )

#     except Exception as e:
#         return jsonify(
    #       {'error': 'An error occurred', 'details': str(e)}
    # ), 500

# Chunking
# https://community.openai.com/t/whisper-maximum-content-size-limit-exceeded/83925
# https: // platform.openai.com/docs/guides/speech-to-text/longer-inputs
