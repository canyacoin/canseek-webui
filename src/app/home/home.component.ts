import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractsService } from '../services/contracts/contracts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit, AfterViewInit {

  currentUser: any = JSON.parse(localStorage.getItem('credentials'));

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private cs: ContractsService) {
  }
  ngOnInit() {

  }

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe((params) => {
      // PARAM? = params['query'] ? params['query'] : '';
    });
  }

  // example fo getting CAN balance
  async getCANBalance() {
    console.log('getting CAN balance');
    const canBalance = await this.cs.getCANBalance();
    console.log('CAN Balance is ', canBalance);
  }

  // example of buying can
  async buyCan(amountInEther = '1') {
    console.log('buying CAN');
    await this.cs.buyCAN(amountInEther);
    const canBalance = await this.cs.getCANBalance();
    console.log('CAN Balance is ', canBalance);
  }

  // example of adding a post
  async addPost(bounty = 1000, cost = 10) {
    console.log('adding post: bounty = %o, cost = %o', bounty, cost);
    const postId = await this.cs.addPost(bounty.toString(), cost.toString());
    console.log('post added: postId %o', postId);
  }

  // Example of getting the total number of posts
  async getNumPosts() {
    console.log('getting total number of posts.');
    const numPosts = await this.cs.getNumPosts();
    console.log('Total Number of Posts: ', numPosts);
  }

  // Example of getting the owner of a post
  async getPostOwner(postId = 0) {
    console.log('getting post %o owner', postId);
    const owner = await this.cs.getPostOwner(postId);
    console.log('Post %o owner: ', postId, owner);
  }

  // Example of getting the status of a post
  async getPostStatus(postId = 0) {
    console.log('getting post %o status', postId);
    const postStatus = await this.cs.getPostStatus(postId);
    console.log('Post %o Status: %o (type: %o)', postId, postStatus, typeof postStatus);
  }

  // Example of cancelling a post
  async cancelPost(postId = 1) {
    console.log('cancelling post ', postId);
    const postStatus = await this.cs.cancelPost(postId);
    console.log('post Status: ', typeof postStatus, postStatus);
  }

  // Example of closing a post
  async closePost(postId = 0, candidateId = 0) {
    console.log('closing post ', postId);
    const postStatus = await this.cs.closePost(postId, candidateId);
    console.log('post %o status: %o', postId, postStatus);
  }

  // Example of getting a post
  async getPost(postId = 0) {
    const post = await this.cs.getPost(postId);
    console.log(post);
  }

  async getAllPosts() {
    const posts = await this.cs.getAllPosts();
    console.log(posts);
  }

  // example of recommend/apply for a post
  async recommend(postId = 0) {
    console.log('recommending to post ', postId);
    const candidateId = await this.cs.recommend(postId);
    console.log('candidate id: ', candidateId);
  }
}
