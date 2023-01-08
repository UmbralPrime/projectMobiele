import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../types/user";
import {DatabaseService} from "../../services/database.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss'],
})
export class AddFriendComponent implements OnInit {
  @Input() friend: User={ id:"", username:''}
  constructor(private dbService:DatabaseService, private authService: AuthService, private router: Router) { }

  ngOnInit() {}
  addFriend(friendId: string){
    this.dbService.addFriend(friendId, this.authService.getUserUID())
    this.router.navigate(['/tabs/friends'])
  }

}
