import { Component, OnInit } from '@angular/core';
import {PhotoService} from "../services/photo.service";
import {Data, Router} from "@angular/router";
import {FirebaseApp} from "@angular/fire/app";
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import {FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes, uploadString} from "@angular/fire/storage";
import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";
import {Photo} from "@capacitor/camera";
import {DatabaseService} from "../services/database.service";
import {from, Observable} from "rxjs";
import {Post} from "../../types/post";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  imgURL = `The image hasn't been uploaded yet`;
  storage: FirebaseStorage;

  metadata = {
    contentType: 'image/jpeg',
  };
  userId: string|undefined;
  fileName = 'file';
  endFileName : string | undefined;
  photo: Photo | null = null;
  postList:Observable<Post[]> = from([]);
  constructor(public photoService : PhotoService, private router:Router,private firebase: FirebaseApp, private databaseService: DatabaseService)
  {
    this.storage = getStorage(firebase);
    FirebaseAuthentication.addListener('authStateChange', user => {
      if (user && user.user != null) {
        this.userId = user.user.uid;
      } else {
        this.userId = undefined;
      }
    });
    this.postList= databaseService.retrievePosts()
  }


  ngOnInit() {
  }
  public async TakePhotoCreatePost() {
    let pic = await this.photoService.takePhoto()
    let customFile = this.fileName + dateTimestampProvider.now()+".png"
    this.endFileName= customFile
    console.log(pic.dataUrl)
    if(Capacitor.isNativePlatform()){
      await this.saveFile(pic.u)
    }
    else
      await this.saveFile(pic.dataUrl,customFile)

    await this.router.navigate(['/create-post', this.endFileName])
  }

  async saveFile(base64Data: string|undefined, filename:string) {

    const imgRef = ref(this.storage, filename);
    if(base64Data == undefined){
      base64Data = "undefined"
    }
    let file: any
      const file: any = this.photoService.base64ToImage(base64Data)

    const uploadResult = await uploadBytes(imgRef, file, this.metadata );
    const url = await getDownloadURL(imgRef);
    this.imgURL = url;
  }
}
