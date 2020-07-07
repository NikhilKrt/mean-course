import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { ErrorComponent } from './error/error.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	
	constructor(private dialog: MatDialog) {}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				let errorMessage = 'An unknownen error occurred!';
				if(error.error.message) {
					errorMessage = error.error.message;
				}
				this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
				return throwError(error);
			})
		);
	}
}
