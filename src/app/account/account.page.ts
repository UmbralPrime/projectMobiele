import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {AlertController} from "@ionic/angular";
import {DatabaseService} from "../services/database.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(public authService: AuthService,private alertController: AlertController, private databaseService: DatabaseService) { }

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
        handler: data=>{
          this.changeUsername(data.Name)
        }
      }]
    });
    await alert.present();
  }
  changeUsername(username:string){
    let userId = this.authService.getUserUID()
    this.databaseService.changeUsername(username,userId)
  }
}
