import { Component, inject, input, OnInit, OnDestroy, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [DatePipe, FormsModule, IconComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})
export class CommentListComponent implements OnInit, OnDestroy {
  applicationId = input.required<string>();

  private commentsService = inject(CommentsService);

  comments = this.commentsService.comments;
  isLoading = this.commentsService.isLoading;
  newComment = signal('');
  submitting = signal(false);

  ngOnInit() {
    this.commentsService.loadComments(this.applicationId());
  }

  ngOnDestroy() {
    this.commentsService.unsubscribe();
  }

  async addComment() {
    const text = this.newComment().trim();
    if (!text) return;

    this.submitting.set(true);
    try {
      await this.commentsService.add(this.applicationId(), text);
      this.newComment.set('');
    } finally {
      this.submitting.set(false);
    }
  }

  async deleteComment(commentId: string) {
    await this.commentsService.remove(this.applicationId(), commentId);
  }
}
