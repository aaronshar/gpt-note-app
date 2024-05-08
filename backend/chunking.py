from pydub import AudioSegment
from pydub.utils import mediainfo, make_chunks
import math
import os

CHUNKS_DIRNAME = "process_chunks"


def chunk_by_duration(myaudio):
    # Determines duration that can fit within 24000000 bytes and creates chunks of that duration.  Stores them inside the C
    # print('inside chunk by duration')
    channel_count = myaudio.channels  # Get channels
    sample_width = myaudio.sample_width  # Get sample width
    duration_in_sec = len(myaudio)/1000  # Length of audio in seconds
    sample_rate = myaudio.frame_rate
    bit_depth = sample_width * 8  # Bit depth

    wav_file_size = (sample_rate * bit_depth *
                     channel_count * duration_in_sec)/8

    file_split_size = 24000000  # 24Mb OR 24,000,000 bytes
    total_num_chunks = wav_file_size // file_split_size

    '''
    Get chunk size by the following method:
    For X duration_in_sec (X) -->  Y wav_file_size
    For K duration in sec  (K) --> For 24MB file size
    K = X * 10Mb / Y
    '''

    chunk_length_in_sec = math.ceil(
        (duration_in_sec * file_split_size)/wav_file_size)  # in seconds
    chunk_length_ms = chunk_length_in_sec * 1000
    chunks = make_chunks(myaudio, chunk_length_ms)

    # Export all of the individual chunks as wav files
    for i, chunk in enumerate(chunks):
        chunk_name = f"{CHUNKS_DIRNAME}/chunk{i}.wav"
        chunk.export(chunk_name)

    # print('total_num_chunks', total_num_chunks) # is float

    return int(total_num_chunks)


def chunkify(my_file):
    try:
        # Create AudioSegment from the audio file (webm) and save as a wav file
        myaudio = AudioSegment.from_file(my_file)
        myaudio.export("output.wav", format="wav")

        # Create chunks (by duration)
        total_num_chunks = chunk_by_duration(myaudio)
        return total_num_chunks

    except Exception as e:
        print("AN ERROR OCCURRED", e)

    return total_num_chunks
