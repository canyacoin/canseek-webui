export class Notify {
    pid: string = '';
    cid: string = '';
    hash: string;
    is_read: boolean = false; // read unread
    payment_type: string = ''; // 'in' 'out' ''
    action_type: string;// 'post', 'refer', 'close', 'cancel', 'getrefund'
    time: number = + new Date;
    user: string;
}
