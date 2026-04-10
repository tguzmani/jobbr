import { Component, inject, input, OnInit, OnDestroy, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { SENTIMENTS } from '../../models/comment.model';

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
  newSentiment = signal<number | null>(null);
  submitting = signal(false);

  sentiments = SENTIMENTS;
  expandedComments = signal<Set<string>>(new Set());
  editingId = signal<string | null>(null);
  editText = signal('');
  editSentiment = signal<number | null>(null);
  editSubmitting = signal(false);

  readonly COMMENT_MAX_LENGTH = 200;

  ngOnInit() {
    this.commentsService.loadComments(this.applicationId());
  }

  ngOnDestroy() {
    this.commentsService.unsubscribe();
  }

  toggleExpand(commentId: string) {
    const set = new Set(this.expandedComments());
    if (set.has(commentId)) {
      set.delete(commentId);
    } else {
      set.add(commentId);
    }
    this.expandedComments.set(set);
  }

  isExpanded(commentId: string): boolean {
    return this.expandedComments().has(commentId);
  }

  startEdit(comment: { id: string; text: string; sentiment: number | null }) {
    this.editingId.set(comment.id);
    this.editText.set(comment.text);
    this.editSentiment.set(comment.sentiment);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  async saveEdit() {
    const id = this.editingId();
    const text = this.editText().trim();
    if (!id || !text) return;

    this.editSubmitting.set(true);
    try {
      await this.commentsService.update(this.applicationId(), id, {
        text,
        sentiment: this.editSentiment()
      });
      this.editingId.set(null);
    } finally {
      this.editSubmitting.set(false);
    }
  }

  async addComment() {
    const text = this.newComment().trim();
    if (!text) return;

    this.submitting.set(true);
    try {
      await this.commentsService.add(this.applicationId(), text, this.newSentiment());
      this.newComment.set('');
      this.newSentiment.set(null);
    } finally {
      this.submitting.set(false);
    }
  }

  async deleteComment(commentId: string) {
    await this.commentsService.remove(this.applicationId(), commentId);
  }
}
