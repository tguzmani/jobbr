import { Component, inject, signal, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { TasksService } from '../services/tasks.service';
import { ApplicationsService } from '../../applications/services/applications.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { TASK_STATUSES, TASK_STATUS_LABELS, TASK_STATUS_COLORS, TASK_TYPES, TASK_TYPE_LABELS, TaskStatus, TaskType } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './task-form.page.html',
  styleUrl: './task-form.page.scss'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tasksService = inject(TasksService);
  private appsService = inject(ApplicationsService);

  isEdit = signal(false);
  saving = signal(false);
  editId = '';

  statuses = TASK_STATUSES;
  STATUS_LABELS = TASK_STATUS_LABELS;
  types = TASK_TYPES;
  TYPE_LABELS = TASK_TYPE_LABELS;

  applications = this.appsService.applications;

  goBack() {
    this.location.back();
  }

  private toLocalDatetimeString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  getStatusColor(): string {
    const val = this.form.get('status')?.value as TaskStatus;
    return TASK_STATUS_COLORS[val] || '#A8A8A8';
  }

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    link: [''],
    type: ['other' as TaskType, Validators.required],
    status: ['to-do' as TaskStatus],
    applicationId: [''],
    dueDate: ['', Validators.required]
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const appId = this.route.snapshot.queryParamMap.get('applicationId');

    if (appId) {
      this.form.patchValue({ applicationId: appId });
    }

    if (id) {
      this.isEdit.set(true);
      this.editId = id;
      const task = await this.tasksService.getById(id);
      if (task) {
        const dueDate = task.dueDate.toDate();
        const dueDateStr = this.toLocalDatetimeString(dueDate);
        this.form.patchValue({
          name: task.name,
          description: task.description || '',
          link: task.link || '',
          type: task.type,
          status: task.status,
          applicationId: task.applicationId || '',
          dueDate: dueDateStr
        });
      }
    }
  }

  async save() {
    if (this.form.invalid) return;
    this.saving.set(true);

    const formVal = this.form.value;
    const dueDate = Timestamp.fromDate(new Date(formVal.dueDate));

    const data = {
      name: formVal.name,
      type: formVal.type,
      status: formVal.status,
      dueDate,
      ...(formVal.description ? { description: formVal.description } : {}),
      ...(formVal.link ? { link: formVal.link } : {}),
      ...(formVal.applicationId ? { applicationId: formVal.applicationId } : {})
    };

    try {
      if (this.isEdit()) {
        await this.tasksService.update(this.editId, data);
        this.router.navigate(['/tasks', this.editId]);
      } else {
        const id = await this.tasksService.add(data);
        this.router.navigate(['/tasks', id]);
      }
    } catch {
      this.saving.set(false);
    }
  }
}
