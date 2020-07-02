import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from "@angular/material/paginator";

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { AuthService } from '../../auth/auth.service';

@Component({
	selector: 'app-post-list',
	templateUrl: './post-list.component.html',
	styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
	posts: Post[] = [];
	isLoading = false;
	totalPosts = 0;
	postsPerPage = 2;
	currentPage = 1;
	pageSizeOptions = [1, 2, 5, 10];
	userIsAuthenticated = false;
	private postsSub: Subscription;
	private authStatusSubs: Subscription;

	constructor(public postsService: PostService, private authService: AuthService) {}

	ngOnInit() {
		this.isLoading = true;
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
		this.postsSub = this.postsService.getPostUpdateListener()
			.subscribe((postData: {posts: Post[], postCount: number}) => {
				this.isLoading = false;
				this.totalPosts = postData.postCount;
				this.posts = postData.posts;
			});
		this.userIsAuthenticated = this.authService.getIsAuth();
		this.authStatusSubs = this.authService.getAuthStatusListener()
			.subscribe(isAuthenticated => {
				this.userIsAuthenticated = isAuthenticated;
			});
	}

	onChangedPage(pageData: PageEvent) {
		this.isLoading = true;
		this.currentPage = pageData.pageIndex + 1;
		this.postsPerPage = pageData.pageSize;
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
	}

	onDelete(postId: string) {
		this.isLoading = true;
		this.postsService.deletePost(postId).subscribe(() => {
			this.postsService.getPosts(this.postsPerPage, this.currentPage)
		});
	}

	ngOnDestroy() {
		this.postsSub.unsubscribe();
		this.authStatusSubs.unsubscribe();
	}
}
