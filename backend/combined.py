from recorder import record_audio
import transcription


def record_and_generate_transcription(newrecording_filename):
    # records 5 seconds of audio at the moment
    new_recording_filepath = record_audio(newrecording_filename)
    transcription.generate_transcription(new_recording_filepath)


def record_and_generate_translation(newrecording_filename):
    # records 5 seconds of audio at the moment
    new_recording_filepath = record_audio(newrecording_filename)
    transcription.generate_translation(new_recording_filepath)


def record_and_generate_enhanced_tr(newrecording_filename, sprompt):
    # records 5 seconds of audio at the moment
    new_recording_filepath = record_audio(newrecording_filename)
    transcription.generate_enhanced_transcription(
        new_recording_filepath, sprompt)


if __name__ == "__main__":
    record_and_generate_transcription("recordingToTranscribe.wav")  # works
    # record_and_generate_translation("recordingToTranslate.wav")  # works
