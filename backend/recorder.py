# https: // realpython.com/playing-and -recording-sound-python/

import pyaudio  # Import the PyAudio library for audio input/output
import wave  # Import the Wave library for reading/writing WAV files
import os

SECONDS = 5


def record_audio(filename):
    '''
    Records 'SECONDS' seconds of audio from computer speakers.
    Saves the audio recording and returns the path of the new recording.
    '''

    # set recording options
    chunk = 1024  # Record in chunks of 1024 samples
    sample_format = pyaudio.paInt16  # 16 bits per sample
    channels = 1
    fs = 44100  # Record at 44100 samples per second
    seconds = SECONDS

    # Configure destination path and filename
    # Get the directory path
    current_directory = os.getcwd()
    destination_subfolder = 'inputs'
    # Combine the directory path with the filename to get the full file path
    full_path = os.path.join(
        current_directory, destination_subfolder, filename)

    # IMP: Cross-platform compatibility: Different operating systems use
    # different path separators (\ for Windows and / for Unix-like systems).
    # os.path.join() automatically handles these differences, ensuring
    # your code works correctly on any platform.

    # print(full_path)

    p = pyaudio.PyAudio()  # Create an interface to PortAudio

    print(f'Recording for {seconds} seconds')

    # Open stream for recording
    stream = p.open(format=sample_format,
                    channels=channels,
                    rate=fs,
                    frames_per_buffer=chunk,
                    input=True)

    frames = []  # Initialize array to store frames

    # Recording - Store data in chunks for the specified number of seconds
    for i in range(0, int(fs / chunk * seconds)):
        data = stream.read(chunk)
        frames.append(data)

    # Stop and close the stream
    stream.stop_stream()
    stream.close()

    # Terminate the PortAudio interface
    p.terminate()

    print(f'Finished recording.  Saved audio file at {full_path}')

    # Save the recorded data as a WAV file
    wf = wave.open(full_path, 'wb')  # wb = write in binary mode
    wf.setnchannels(channels)
    wf.setsampwidth(p.get_sample_size(sample_format))
    wf.setframerate(fs)
    wf.writeframes(b''.join(frames))
    wf.close()

    return full_path


if __name__ == "__main__":
    record_audio('mynewrecording.wav')
