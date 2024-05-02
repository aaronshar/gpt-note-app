# import openai
from flask import jsonify
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


key = os.getenv("OPENAI_API_KEY")
# print(key, type(key))
# Load OpenAI API key from an environment variable
client = OpenAI(
    api_key=key
)


def generate_tags(text):
    try:
        stream = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": f"""Extract key concepts
            from the following text as a comma-separated list of tags(limit it
            to 6 tags):{text}"""}],
            stream=False,
            max_tokens=100,
            temperature=0.5
        )
        return jsonify({"tags": stream.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
