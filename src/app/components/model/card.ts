import { Candidate } from './candidate';

export class Card {
    id: number;
    status: string; // open closed canceled
    title: string; // job title
    ownerAddr: string; 
    company: string;
    logo: string;
    bounty: number;
    cost: number;
    desc: string;
    candidates: Candidate[]; // 候选人数
}
