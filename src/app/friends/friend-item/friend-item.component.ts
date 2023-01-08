import {Component, Input, OnInit} from '@angular/core';
import {Friend} from "../../../types/friend";
import {DatabaseService} from "../../services/database.service";
import {User} from "../../../types/user";

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss'],
})
export class FriendItemComponent implements OnInit {
  @Input() friend: Friend={ friendId:"", userId:''}
  friendName: string = ''
  constructor(private dbService: DatabaseService) {
  }
  async SetData(){
    this.friendName = await this.lookupUsername(this.friend.friendId)
  }

  ngOnInit() {
    this.SetData()
  }
  async lookupUsername(userId: string): Promise<string> {
    let user = await this.dbService.retrieveUsername(userId) as User;
    if (user.username){
      return user.username.toString()
    }
    else
      return "Username not found"
  }


}
