import { Candidate } from './candidate';

export class Card {
    id: number;
    status: string = 'open'; // open closed canceled
    title: string; // job title
    ownerAddr: string; 
    company: string;
    logo: string;
    email: string;
    bounty: number;
    cost: number;
    desc: string;
    candidates: Candidate[]; // 候选人数
}

export const statusArr = ['pending', 'failed', 'open', 'closed', 'cancelled'];