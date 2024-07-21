import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit {
  public appPages = [
    { title: 'Orders', url: '/orders', icon: 'warning' },
    { title: 'Category', url: '/category', icon: 'mail' },
    { title: 'Sub Category', url: '/sub-category', icon: 'paper-plane' },
    { title: 'Master Catalog', url: '/master-catalog', icon: 'heart' },
    { title: 'Store Catalog', url: '/store-catalog', icon: 'archive' },
    // { title: 'Excel Errors Dump', url: '/excel-dump', icon: 'warning' },
    { title: 'Excel Errors Resolve', url: '/error-resolve-by-product', icon: 'warning' },
    { title: 'Stores', url: '/stores', icon: 'trash' },
    { title: 'Users', url: '/users', icon: 'warning' },
    { title: 'Bar Code Scanner', url: '/scan', icon: 'heart' },
  ];
  constructor() { }

  ngOnInit() {
  }

}
