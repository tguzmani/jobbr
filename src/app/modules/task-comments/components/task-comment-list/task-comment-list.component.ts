import { Component, inject, input, OnInit, OnDestroy, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskCommentsService } from '../../services/task-comments.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-task-comment-list',
  standalone: true,
  imports: [DatePipe, FormsModule, IconComponent],
  templateUrl: './task-comment-list.component.html',
  styleUrl: './task-comment-list.component.scss'
})
export class TaskCommentListComponent implements OnInit, OnDestroy {
  taskId = input.required<string>();

  private commentsService = inject(TaskCommentsService);

  comments = this.commentsService.comments;
  isLoading = this.commentsService.isLoading;
  newComment = signal('');
  submitting = signal(false);

  ngOnInit() {
    this.commentsService.loadComments(this.taskId());
  }

  ngOnDestroy() {
    this.commentsService.unsubscribe();
  }

  async addComment() {
    const text = this.newComment().trim();
    if (!text) return;

    this.submitting.set(true);
    try {
      await this.commentsService.add(this.taskId(), text);
      this.newComment.set('');
    } finally {
      this.submitting.set(false);
    }
  }

  async deleteComment(commentId: string) {
    await this.commentsService.remove(this.taskId(), commentId);
  }
}
