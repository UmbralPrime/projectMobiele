import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, PermissionStatus, Photo} from '@capacitor/camera';
import {Preferences} from '@capacitor/preferences';
import {Capacitor} from "@capacitor/core";
import {Directory, Filesystem} from "@capacitor/filesystem";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  readonly #photos: Photo[] = [];
  readonly #storageKey = 'photos';

  #photoURIs: string[] = [];
  #permissionGranted: PermissionStatus = {camera: 'granted', photos: 'granted'};
  constructor() {
    this.#loadData();
  }
  public base64ToImage(dataURI:string ) {
    const fileDate = dataURI.split(',');
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }
  async #loadData(): Promise<void> {
    await this.#retrievePhotoURIs();
    await this.#retrievePermissions();
    await this.#loadPhotos();
  }
  getPhotos(): Photo[] {
    return this.#photos;
  }
  async #retrievePhotoURIs(): Promise<void> {
    const uris = await Preferences.get({key: this.#storageKey});

    if (uris.value) {
      this.#photoURIs = JSON.parse(uris.value) ?? [];
    }
  }
  async #persistPhotoURIs(): Promise<void> {
    await Preferences.set({
      key: this.#storageKey,
      value: JSON.stringify(this.#photoURIs)
    });
  }

  async #requestPermissions(): Promise<void> {
    try {
      this.#permissionGranted = await Camera.requestPermissions({permissions: ['photos', 'camera']});
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  }

  async #retrievePermissions(): Promise<void> {
    try {
      this.#permissionGranted = await Camera.checkPermissions();
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  }
  #haveCameraPermission(): boolean {
    return this.#permissionGranted.camera === 'granted';
  }

  #havePhotosPermission(): boolean {
    return this.#permissionGranted.photos === 'granted';
  }
  #determinePhotoSource(): CameraSource {
    if (this.#havePhotosPermission() && this.#haveCameraPermission()) {
      return CameraSource.Prompt;
    } else {
      return this.#havePhotosPermission() ?
        CameraSource.Photos : CameraSource.Camera;
    }
  }
  async #takePhotoNative(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      saveToGallery: this.#havePhotosPermission(),
      source: this.#determinePhotoSource()
    });
    const uri = await this.#saveImageToFileSystem(image);
    this.#photoURIs.push(uri);

    this.#photos.push(image);
  }
  async #takePhotoPWA(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      saveToGallery: this.#havePhotosPermission(),
      source: this.#determinePhotoSource()
    });
    const uri = await this.#saveImageToFileSystem(image);
    this.#photoURIs.push(uri);
    image.path = uri;
    image.dataUrl = `data:image/${image.format};base64,${image.base64String}`;
    this.#photos.push(image);
  }
  async #saveImageToFileSystem(photo: Photo): Promise<string> {
    const fileName = `${new Date().getTime()}.${photo.format}`;
    if(!photo.base64String){
      return "";
    }
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: photo.base64String,
      directory: Directory.Data
    });
    return savedFile.uri;
  }

  async takePhoto(): Promise<Photo> {
    if (!this.#haveCameraPermission() || !this.#havePhotosPermission()) {
      await this.#requestPermissions();
    }

    await this.#takePhotoPWA();
    await this.#persistPhotoURIs();
    console.log(this.#getLastPhoto())
    return await this.#getLastPhoto()
  }
  async #loadPhotos(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await this.#loadPhotosNative();
    } else {
      await this.#loadPhotosPWA();
    }
  }
  async #getLastPhoto(): Promise<Photo> {
    return this.#photos[this.#photos.length-1]
  }
  #getPhotoFormat(uri: string): string {
    const splitUri = uri.split('.');
    return splitUri[splitUri.length - 1];
  }
  async #loadPhotosNative(): Promise<void> {
    for (const uri of this.#photoURIs) {
      this.#photos.push({
        path: uri,
        format: this.#getPhotoFormat(uri),
        webPath: Capacitor.convertFileSrc(uri),
        saved: this.#havePhotosPermission()
      });
    }
  }
  async #loadPhotosPWA(): Promise<void> {
    for (const uri of this.#photoURIs) {

      const data = await Filesystem.readFile({
        path: uri
      });

      const format = this.#getPhotoFormat(uri);
      this.#photos.push({
        dataUrl: `data:image/${format};base64,${data.data}`,
        format,
        path: uri,
        saved: false
      });
    }
  }
}
