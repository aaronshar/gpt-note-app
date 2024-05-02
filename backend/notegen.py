import os
import openai
from dotenv import load_dotenv
import sampletranscript

load_dotenv()

openai.openai_api_key = os.getenv("OPENAI_API_KEY")

# print(openai.openai_api_key)


def create_system_prompt_for_text_input(options):
    """
    Creates and returns a system prompt string based on the
    contents of the given 'options'.

    Args:
        options: A dictionary representing user-selected options
        for note generation.  Keys and possible values below:

            KEY                 POSSIBLE VALUES
            'format'            'bullet', 'paragraph'
            'headings'          True, False
            'detail'            'high', 'medium', 'low'
            'organization'      'chronological', 'topic'

    Returns:
        system_prompt: a system prompt string reflecting user options

    """

    system_prompt = (
        'Your task is to generate notes from the transcribed text, '
        'adhering to the following guidelines: The notes should focus '
        'solely on the content itself, omitting any references to the '
        'lecture or the speaker. '
    )

    # format ('bullet' / 'plain')
    if options['format'] == 'bullet':
        system_prompt += (
            'Generate notes in bullet-point format. '
        )
    else:
        system_prompt += (
            'Generate notes in paragraph-form with full sentences, '
            'rather than bullet-points. '
        )

    # headings (T/F) if "format" is 'paragraph', should be FALSE
    if options['headings']:
        system_prompt += (
            'Organize the notes with headings and/or subheadings. '
        )
    else:
        system_prompt += (
            'Organize the notes without headings and/or subheadings. '
        )

    # detail-level? ('detailed' / 'ßmedium' / 'brief')
    if options['detail'] == 'high':
        system_prompt += (
            'The detail level should be high; Include all relevant '
            'points and examples. '
        )
    elif options['detail'] == 'medium':
        system_prompt += (
            'The detail level should be medium; Summarize key points, '
            'omitting some details. '
        )
    elif options['detail'] == 'low':
        system_prompt += (
            'The detail level should be low; Capture only the main ideas and '
            'key concepts. '
        )
    # organization? ('chronological' / 'topic')
    if options['organization'] == 'chronological':
        system_prompt += 'Arrange notes in the order they appear in the text. '
    else:
        system_prompt += 'Arrange notes based on topics or themes. '

    print("SYSTEM PROMPT: ", system_prompt, '\n')
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
        print(response.choices[0].message.content)
        return response.choices[0].message.content

    except Exception as e:
        print("An error occurred:", e)


options = {
    'format': 'paragraph',
    'headings': True,
    'detail': 'high',
    'organization': 'chronological',
}

system_prompt = create_system_prompt_for_text_input(options)
original_transcript = sampletranscript.text
generate_note(0, system_prompt, original_transcript)
