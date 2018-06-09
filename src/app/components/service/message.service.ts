import { Injectable } from '@angular/core';
import { Message } from '../model/message';

@Injectable()
export class MessageService {

  // constructor() { }
  messages: Message[] = [];

  add(message: Message) {
    this.messages.push(message);
    // setTimeout(() => this.close(message), message.duration);
  }
  close(message) {
    const index: number = this.messages.indexOf(message);
    this.messages[index].hide = true;
    setTimeout(
      () => this.messages.splice(index, 1),
      314
    )
  }
}
