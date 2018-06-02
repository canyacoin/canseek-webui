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
    // candidates: Candidate[]; // 候选人数
}

export const statusArr = ['pending', 'open', 'closed', 'cancelled'];