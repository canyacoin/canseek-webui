export function handleTextarea(i, str) {
    const fields = ['company_desc', 'job_desc', 'reason', 'answer', 'answer2', 'answer3'];
    if (fields.includes(i)) {
        return str
                .trim()
                .split('\n')
                .map(item => `<p>${item}</p>`)
                .join('')
    }
    return;
}