import { Component, Input, OnInit } from '@angular/core';
import { TaskB } from 'src/models/task-b';

@Component({
  selector: 'tm-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() task!: TaskB;

  constructor() { }

  ngOnInit(): void {
  }

}
