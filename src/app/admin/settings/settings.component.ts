import { Component, OnInit } from '@angular/core';
import { CartService, Cart } from '../../client';
import { Utils } from '../../utils/order';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './settings.component.html'
})
export class AdminSettingsComponent implements OnInit {

  updateThumbnailsResult: string;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
  }

  UpdateThumbnails() {
    this.updateThumbnailsResult = '';
    this.http.get('/api/product/update_thumb').subscribe(result => {
      this.updateThumbnailsResult =  JSON.stringify(result);
    });
  }

}
