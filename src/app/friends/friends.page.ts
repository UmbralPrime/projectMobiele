import { Component, OnInit } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {from, Observable} from "rxjs";
import {Post} from "../../types/post";
import {DatabaseService} from "../services/database.service";
import {Friend} from "../../types/friend";
import {User} from "../../types/user";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friendList:Observable<Friend[]> = from([]);
  searchedList:Observable<User[]>= from([]);
  constructor(private alertController: AlertController, private dbService: DatabaseService, private authService: AuthService) {
    this.friendList=this.dbService.retrieveFriends();
  }

  ngOnInit() {
  }
  async PresentUsernameAlert(){
    const alert = await this.alertController.create({
      header: "Please type in your username",
      inputs: [
        {
          name:'Name',
          placeholder: 'Name'
        }
      ],
      buttons: [{
        text: 'Cancel'
      },{
        text: 'OK',
        handler: async data => {
          await this.lookupUsername(data.Name)
        }
      }]
    });
    await alert.present();
  }
  async lookupUsername(username: string) {
    this.searchedList= this.dbService.retrieveUsers(username);
  }
}
