export class Notify {
    id = '';
    pid = '';
    cid = '';
    hash: string;
    is_read = false; // read unread
    payment_type = ''; // 'in' 'out' ''
    action_type: string; // 'post', 'refer', 'close', 'cancel', 'getrefund'
    time: number = + new Date;
    user: string;
}
