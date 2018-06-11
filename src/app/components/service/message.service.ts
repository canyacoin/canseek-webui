import { Injectable } from '@angular/core';
import { Message } from '../model/message';

@Injectable()
export class MessageService {

  // constructor() { }
  messages: Message[] = [];

  add(message: Message) {
    this.messages.push(message);
    message.type !== 'loading' && setTimeout(() => this.close(message), message.duration);
  }
  close(message) {
    setTimeout(() => {
      const index: number = this.messages.indexOf(message);
      if (index !== -1) {
        this.messages[index].hide = true;
        setTimeout(
          () => this.messages.splice(index, 1),
          314
        )
      }
    }, 1314);
  }
}
