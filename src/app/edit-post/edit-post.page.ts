import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PhotoService} from "../services/photo.service";
import {Photo} from "@capacitor/camera";
import {ToastController} from "@ionic/angular";
import {DatabaseService} from "../services/database.service";
import {Post} from "../../types/post";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {
  imgURL: string  = `The image hasn't been uploaded yet`;
  user: string ="";
  dateTaken: number= 2/12/2000;

  latitude: number=0;
  longitude: number=0;
  description: string="";
  titlePost: string="";
  postId: string | null ="";

  post: Post ={dateTaken: 0, description: "", imageUrl: "", latitude: 0 , longitude:0, titlePost: "", user:""}
  constructor(public activatedRoute: ActivatedRoute,public router : Router, public databaseService: DatabaseService ) { }
  async setData(): Promise<void> {
    this.postId = this.activatedRoute.snapshot.paramMap.get('index');
    if (this.postId != null)
      this.post = await this.databaseService.getPost(this.postId);
      this.user=this.post.user;
      this.dateTaken=this.post.dateTaken;
      this.latitude=this.post.latitude;
      this.longitude=this.post.longitude;
      this.description=this.post.description;
      this.titlePost=this.post.titlePost;
      this.imgURL=this.post.imageUrl;
  }
  async deletePost() {
    if (this.postId != null)
      await this.databaseService.deletePost(this.postId)

    await this.router.navigate(['/tabs/gallery'])
  }
  async updatePost(){
    this.post.user=this.user;
    this.post.dateTaken=this.dateTaken;
    this.post.latitude=this.latitude;
    this.post.longitude=this.longitude;
    this.post.description=this.description;
    this.post.titlePost=this.titlePost;
    this.post.imageUrl=this.imgURL;
    if(this.postId!=null)
      await this.databaseService.updatePost(this.postId, this.post)

    await this.router.navigate(['/tabs/gallery'])
  }

  ngOnInit(): void {
    this.setData();
  }

}
