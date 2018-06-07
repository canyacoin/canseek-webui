import { Candidate } from './candidate';

export class Card {
    id: string = ''; // firestore unique id
    postId: number = 0; // block chain id
    status: string = 'pending'; // pending/failed open closed canceled
    nextStatus: string = 'open'; // record next status
    title: string = ''; // job title
    ownerAddr: string = ''; 
    company: string = '';
    logo: string = '';
    email: string = '';
    bounty: number = null;
    cost: number = null;
    desc: string = '';
    honeypot: number = 0;
    candidates: number = 0; // 候选人数
    recommenders: object = {}; // 推荐人
    time: string;
}

export const statusArr = ['pending', 'open', 'closed', 'cancelled'];