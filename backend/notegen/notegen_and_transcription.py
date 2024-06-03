# Author: Sayhee Kim

import openai
import whisper

from notegen.notegen_errors import (
    TranscriptionError,
    NoteGenerationError
)


def transcribe_using_local_whisper(input_filepath, prompt):
    try:

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

        print("SELECTED OPTIONS: ", my_options, '\n')

        result = model.transcribe(**my_options)
        print("Finished transcribing locally!", '\n')

        # print(result)

        return result['text']

    except Exception as e:
        raise TranscriptionError(f"{e}")


def transcribe_using_api(filepath, *args, **kwargs):
    try:
        audio_file = open(filepath, "rb")

        # default options
        my_options = {
            'model': "whisper-1",
            'file': audio_file,
            # 'language': 'en',
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

        print("SELECTED OPTIONS: ", my_options, '\n')

        # request transcription
        response = openai.audio.transcriptions.create(**my_options)

        # EXPLANATION OF PARAMS (see full list here:
        # https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)

        print("Finished transcribing using api!", '\n')

        # Return the response
        if my_options['response_format'] == 'text':
            return response

        # print('RESPONSE:\n', response, '\n')
        print('RESPONSE TEXT:\n', response.text, '\n')
        return response.text

    except FileNotFoundError:
        # print("File not found.")
        raise TranscriptionError("File not found")

    except Exception as e:
        print("An error occurred:", e)
        raise TranscriptionError(e)


# All requests end up here eventually:
def get_notes_on_text(text):
    try:
        options = {
            'format': 'bullet',
            'headings': True,
            'detail': 'high',
            'organization': 'chronological',
        }

        system_prompt = create_system_prompt_for_note_gen(options)

        print(system_prompt)

        note = request_notes_from_chat_api(0, system_prompt, text)
        print(note)
        return note

    except Exception as e:
        print("An error occurred:", e)
        raise NoteGenerationError(e)


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
                     'text, adhering to the following guidelines:'
                     'The notes should focus solely on the content itself. '
                     'Omit any references to the lecture or the speaker. '
                     'Make notes in the same language as the original text. '
                     'Produce notes in this format, as much as possible:'
                     '\nName of Topic:\n'
                     '- Note about this topic\n'
                     '- Another Note about this topic\n'
                     '(etc)\n\n'
                     '\nName of Another Topic, if any:\n'
                     '- Note about this topic\n'
                     '- Note about this topic.\n'
                     '(etc)\n\n'
                     'Make sure there is a blank line between'
                     'different topics. '
                     )

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
        raise NoteGenerationError(e)
