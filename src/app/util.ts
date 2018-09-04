import * as moment from 'moment-timezone';

export function wrapTextarea(i, str = '') {
    const fields = ['company_desc', 'job_desc', 'reason', 'answer', 'answer2', 'answer3'];
    if (fields.includes(i) && str.length) {
        return str
                .trim()
                .split('\n')
                .map(item => `<p>${item}</p>`)
                .join('')
    }
    return str;
}
export function unwrapTextarea(str = '') {
    return str
            .trim()
            .replace(/<(\/)?p>/g, '\n')
            .replace(/(\n)+/g, '\n')
            .trim()
}
export const formatLocation = (tz: string) => {
    const UTCOffset = moment.tz(tz).format().slice(-6);

    return tz.replace(/\//g, ', ') + ' UTC ' + UTCOffset;
}
export const clearEmpty = (value) => {
    if ([undefined, null, 'undefined', 'null'].includes(value)) {
        return null;
    } 
    return value;
}