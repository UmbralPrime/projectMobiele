import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {
  collection,
  CollectionReference,
  doc,
  Firestore,
  DocumentReference,
  addDoc,
  getDoc,
  collectionData, query, where, updateDoc, deleteDoc, setDoc
} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {
  getStorage,
  ref,
  FirebaseStorage,
} from "@angular/fire/storage";
import {FirebaseApp} from "@angular/fire/app";
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import {Post} from "../../types/post";
import {PhotoService} from "./photo.service";
import {User} from "../../types/user";
import {Friend} from "../../types/friend";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  storage: FirebaseStorage;
  userId: string | undefined;
  user: User = {id: '', username:""}
  foundUser: User={id: '', username:''}
  friend: Friend={friendId: '', userId:''}

  private imgURL = 'Image hasnt been uploaded yet.';
  constructor(private authService : AuthService, private fireStore: Firestore,private firebase: FirebaseApp, private photoService: PhotoService) {
    this.storage = getStorage(firebase);
    FirebaseAuthentication.addListener("authStateChange", user => {
      if (user) {
        this.userId = user.user?.uid;
      } else {
        this.userId = undefined;
      }
    });
  }
  #getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.fireStore, collectionName) as CollectionReference<T>;
  }
  #getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
    return doc(this.fireStore, `${collectionName}/${id}`) as DocumentReference<T>;
  }
  async SendPost(post: Post): Promise<void>{
    const newPost= {
      dateTaken : post.dateTaken,
      user: post.user,
      latitude: post.latitude,
      longitude: post.longitude,
      description: post.description,
      titlePost: post.titlePost,
      imageUrl: post.imageUrl
    };
    await addDoc<Post>(this.#getCollectionRef<Post>('post'),newPost)
  }
  retrievePosts(): Observable<Post[]> {
    return collectionData<Post>(
      query<Post>(
        this.#getCollectionRef('post'),
        where('user' ,'==', this.authService.getUserUID())
      ),
      {idField: 'id'}
    );
  }
  retrieveFriends(): Observable<Friend[]>{
    return collectionData<Friend>(
      query<Friend>(
        this.#getCollectionRef('friend'),
        where('userId','==',this.authService.getUserUID())
      ),
      {idField: 'id'}
    )
  }
  async retrieveUsername(userId: string): Promise<User>{
    const docRef = doc(this.fireStore,'user', userId)
    const docSnap = await getDoc(docRef);
    const user = docSnap.data() as User;
    return user;
  }
  async getPost(postId: string): Promise<Post> {
    const docRef = doc(this.fireStore, 'post', postId)
    const docSnap = await getDoc(docRef);
    const post = docSnap.data() as Post
    return post;
  }
  async updatePost(id:string, post:Post):Promise<void>{
      delete post.id;
      await updateDoc(this.#getDocumentRef('post',id),post)
  }
  async deletePost(id:string): Promise<void>{
    await deleteDoc(this.#getDocumentRef('post',id))
  }
  async changeUsername(username: string, userId: string){
    const docRef = doc(this.fireStore, 'user', userId)
    const docSnap = await getDoc(docRef);
    this.user.username=username;
    this.user.id=userId;
    if(docSnap.exists()){
      await updateDoc(this.#getDocumentRef('user', userId),this.user)
    }
    else{
      await setDoc<User>(this.#getDocumentRef('user',userId),this.user)
    }
  }
  retrieveUsers(username: string): Observable<User[]> {
    let users = collectionData<User>(
      query<User>(
        this.#getCollectionRef('user'),
        where('username', '==', username)
      ), {
        idField: 'username'
      }
    )
    return users
  }
  async addFriend(friendId: string, userId: string) {
    this.friend.friendId= friendId;
    this.friend.userId=userId
    await addDoc<Friend>(this.#getCollectionRef('friend'),this.friend)
  }
}
