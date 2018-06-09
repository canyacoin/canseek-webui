export class Message {
    type: string = 'info'; // success warning error loading info
    message: string = 'message';
    duration: number = 5000; // 1s 之后消失
    hide: boolean = false;
}
