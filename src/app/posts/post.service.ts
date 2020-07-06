import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
	private posts: Post[] = [];
	private postUpdated = new Subject<{posts: Post[], postCount: number}>();

	constructor(private http: HttpClient, private router: Router) {}

	getPosts(postsPerPage: number, currentPage: number) {
		const queryParams = `?pageSize=${postsPerPage}&pages=${currentPage}`;
		this.http.get<{message: string, posts: any, maxPost: number}>('http://localhost:3000/api/posts' + queryParams)
			.pipe(map((postData) => {
				return {posts: postData.posts.map(post => {
					return {
						title: post.title,
						content: post.content,
						id: post._id,
						imagePath: post.imagePath,
						creator: post.creator
					}
				}), 
					maxPost: postData.maxPost
				}
			}))
			.subscribe((transformedPostData) => {
				this.posts = transformedPostData.posts;
				this.postUpdated.next({
					posts: [...this.posts], 
					postCount: transformedPostData.maxPost
				});
			})
	}

	getPost(id: string) {
		return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>('http://localhost:3000/api/posts/'+ id);
	}

	getPostUpdateListener() {
		return this.postUpdated.asObservable();
	}

	addPost(title: string, content: string, image: File) {
		const postData = new FormData();
		postData.append('title', title);
		postData.append('content', content);
		postData.append('image', image, title);
		this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
			.subscribe((responseData) => {
				this.router.navigate(["/"]);
			});
	}

	updatePost(id: string, title: string, content: string, image: File | string) {
		let postData: Post | FormData;
		if(typeof(image) === 'object') {
			postData = new FormData();
			postData.append("id", id);
			postData.append('title', title);
			postData.append('content', content);
			postData.append('image', image, title);
		} else {
			postData = {
				id: id,
				title: title,
				content: content,
				imagePath: image,
				creator: null
			}
		}

		this.http.put('http://localhost:3000/api/posts/' + id, postData)
			.subscribe((response) => {
				this.router.navigate(["/"]);
			});
	}

	deletePost(postId: string) {
		return this.http
			.delete('http://localhost:3000/api/posts' + postId);
	}
}
