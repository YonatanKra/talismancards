export async function listSVGs() {
    try {
        const response = await fetch(`/api/list-cards`);

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fileNames = await response.json();
        return fileNames;
    } catch (error) {
        console.error('Error listing SVGs:', error);
        throw error;
    }
}