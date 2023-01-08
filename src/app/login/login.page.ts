import { Component, OnInit } from '@angular/core';
import {Capacitor} from "@capacitor/core";
import {AuthService} from "../services/auth.service";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isNative = Capacitor.isNativePlatform();

  constructor(public authService: AuthService, private modalController: ModalController) { }


  ngOnInit() {
  }
}

