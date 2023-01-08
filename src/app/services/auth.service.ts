import {Injectable} from '@angular/core';
import {Auth, signInWithCredential, signOut} from '@angular/fire/auth';
import { GoogleAuthProvider, User,GithubAuthProvider, Unsubscribe} from 'firebase/auth';
import {Capacitor} from "@capacitor/core";
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);
  #authUnsubscribe: Unsubscribe;
  constructor(public auth: Auth, public router: Router) {
    this.#authUnsubscribe = this.auth.onAuthStateChanged(user => this.setCurrentUser(user));
  }
  private async setCurrentUser(user: User | null): Promise<void> {
    this.currentUser.next(user);
    if (this.currentUser) {
      await this.router.navigate(['/']);
    } else {
      await this.router.navigate(['/login']);
    }
  }

  async signInWithGoogle(): Promise<void> {
    // Sign in on the native layer.

    const result = await FirebaseAuthentication.signInWithGoogle();

    if (!result?.credential?.idToken) {
      return;
    }

    const idToken = result.credential.idToken;
    // Sign in on the web layer.
    if (Capacitor.isNativePlatform()) {
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(this.auth, credential);
    }
  }

  async SignInWithGithub(): Promise<void >{
    const result = await FirebaseAuthentication.signInWithGithub();
    if(!result?.credential?.idToken)
      return;
    const idToken = result.credential.idToken;
    if(Capacitor.isNativePlatform()){
      const credential = GithubAuthProvider.credential(idToken);
      await signInWithCredential(this.auth, credential);
    }
  }
  #verificationId: string = ""

  async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();

    if (Capacitor.isNativePlatform()) {
      await signOut(this.auth);
    }
    this.router.navigate(['/login'])
  }

  public getUserUID(){
    let userUID= this.currentUser.value?.uid
    if (userUID == undefined){
      userUID = "error"
    }
    return userUID;
  }

}
