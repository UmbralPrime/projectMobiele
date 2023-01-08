import {Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, Marker} from "@capacitor/google-maps";
import {from, Observable} from "rxjs";
import {Post} from "../../types/post";
import {DatabaseService} from "../services/database.service";


@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})

export class MapPage implements OnInit {

  @ViewChild('map')mapRef: ElementRef | undefined;
  apiKey = 'AIzaSyA9DJVcyBK8PD68djLL2V7tLDhf_XlrIBw';
  thisMap: GoogleMap|undefined;
  postsList: Observable<Post[]> = from([]);

  constructor(private dbService: DatabaseService) {
  }
  ionViewDidEnter(){
    this.createMap();
  }
  async createMap() {
    if(this.mapRef!=null){
      this.thisMap = await GoogleMap.create({
        id: 'my-map',
        element: this.mapRef.nativeElement,
        apiKey: this.apiKey,
        forceCreate:true,
        config: {
          center: {
            lat: 51.3175,
            lng: 4.9292,
          },
          zoom: 12,
        },
      })
      await this.addMarkers();
    }

  }
  async addMarkers(){
    this.postsList = this.dbService.retrievePosts();
    const markers: Marker[]=[{
      coordinate:{
        lat: 51.3175,
        lng: 4.9292
      },
      title:'Thomas More Turnhout',
      snippet: 'Hier is de campus van Thomas More Turnhout'
    }]
    this.postsList.forEach(x=>x.map(x=>markers.push({
      coordinate:{
        lat: x.latitude,
        lng: x.longitude
      },
      title: x.titlePost,
      snippet: x.description
    })))
    await this.thisMap?.addMarkers(markers);
    //Wanneer je op een marker wilt klikken en extra info wilt zien
    //Niet geimplementeerd, maar wel mogelijk :)
    //this.thisMap?.setOnMarkerClickListener(async (marker)=>{ console.log(marker)})
  }

  ngOnInit() {
  }

}
