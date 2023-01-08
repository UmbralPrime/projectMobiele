import { Component, OnInit, Input } from '@angular/core';
import {Post} from "../../../types/post";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: Post ={titlePost : "", user: "", imageUrl: "", description:"", longitude:0, latitude:0,dateTaken:Date.now()};
  constructor() { }

  ngOnInit() {}

}
