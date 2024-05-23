import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const updateOldTags = async () => {
    try {
        // Get the current user
        const { currentUser } = useAuth();
        let accessToken: string | null = null;
        await currentUser?.getIdToken().then((token) => {
            accessToken = token;
        });

        // Fetch current notes
        const response = await fetch("http://127.0.0.1:8080/api/mynotes", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const notesData = await response.json();

        // Update each note with the actual tags
        for (const note of notesData) {
            // Check if the tags are old ones ("a", "b", "c")
            if (note.tags.includes("a") && note.tags.includes("b") && note.tags.includes("c")) {
                // Fetch actual tags
                const tagsResponse = await axios.post('http://127.0.0.1:5000/generate-tags', {
                    text: note.content,
                });

                const actualTags: string[] = tagsResponse.data.tags || [];

                // Update note with actual tags
                await fetch(`http://127.0.0.1:8080/api/mynotes/${note.note_id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        "title": note.title,
                        "content": note.content,
                        "tags": actualTags,
                        "bulletpoints": note.bulletpoints
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            }
        }

        console.log('All old notes updated with actual tags.');

    } catch (error) {
        console.error('Error updating tags:', error);
    }
};

export default updateOldTags;
