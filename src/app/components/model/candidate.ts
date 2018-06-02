export class Candidate {
    id: string = ''; // firestore id
    candidateId: number = 0; // block chain id
    name: string = '';
    contact: string = '';
    desc: string = '';
    status: string = 'pending'; // pending ok cancel
}
