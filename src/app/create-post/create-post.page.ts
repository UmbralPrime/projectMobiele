import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PhotoService} from "../services/photo.service";
import {FirebaseStorage, getDownloadURL, getStorage, ref} from "@angular/fire/storage";
import {FirebaseApp} from "@angular/fire/app";
import {Post} from "../../types/post";
import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";
import {formatDate} from "@angular/common";
import {AuthService} from "../services/auth.service";
import {DatabaseService} from "../services/database.service";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  imgURL: string  = `The image hasn't been uploaded yet`;
  user: string ="";
  dateTaken: number= 2/12/2000;
  latitude: number=0;
  longitude: number=0;
  description: string="";
  titlePost: string="";
  fileName: string | null = "not found";
  private storage: FirebaseStorage ;
  constructor(public activatedRoute: ActivatedRoute, private router:Router, private firebase: FirebaseApp, private authService: AuthService, private databaseService: DatabaseService) {
    this.storage = getStorage(firebase);

  }
  async setData(): Promise<void> {
    this.fileName = this.activatedRoute.snapshot.paramMap.get('index')
    if(this.fileName!= null){
      const imgRef = ref(this.storage, this.fileName);
      this.imgURL = await getDownloadURL(imgRef);
    }
    else
      this.imgURL = "not found";
  }
  ngOnInit(): void {
    this.setData();
  }
  async CreatePost(): Promise<void> {
    let post = {
      dateTaken: this.dateTaken,
      user: this.authService.getUserUID(),
      latitude: this.latitude,
      longitude: this.longitude,
      description: this.description,
      titlePost: this.titlePost,
      imageUrl: this.imgURL
    }
    await this.databaseService.SendPost(post)
    await this.router.navigate(['/tabs/gallery'])
  }
}
