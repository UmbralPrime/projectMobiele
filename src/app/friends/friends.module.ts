import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsPageRoutingModule } from './friends-routing.module';

import { FriendsPage } from './friends.page';
import {FriendItemComponent} from "./friend-item/friend-item.component";
import {AddFriendComponent} from "./add-friend/add-friend.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsPageRoutingModule
  ],
    declarations: [FriendsPage, FriendItemComponent, AddFriendComponent]
})
export class FriendsPageModule {}
