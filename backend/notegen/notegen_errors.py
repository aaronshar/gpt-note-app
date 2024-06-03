# Author: Sayhee Kim

class UnrecognizableFiletypeException(Exception):
    """Exception raised for upload of file with an
    undeterminable type"""

    def __init__(self, message="Filetype cannot be determined"):
        self.message = message
        super().__init__(self.message)


class TextFileProcessingError(Exception):
    """Exception raised for upload of text file that cannot be
    read - most likely not a text file"""

    def __init__(self, message=(
                 "Unable to process file.  Please make sure "
                 "to upload a text file.")):
        self.message = message
        super().__init__(self.message)


class InvalidFiletypeException(Exception):
    """Exception raised for upload of file with a type thatnot
    accepted by OpenAI's Audio API."""

    def __init__(self, message="Filetype not accepted by OpenAI's Audio API"):
        self.message = message
        super().__init__(self.message)


class TranscriptionError(Exception):
    def __init__(self, message="An error occured during transcription"):
        self.message = message
        super().__init__(self.message)


class NoteGenerationError(Exception):
    def __init__(self, message="An error occured during note generation"):
        self.message = message
        super().__init__(self.message)
