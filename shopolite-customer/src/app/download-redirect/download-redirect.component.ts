import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'app-download-redirect',
  template: '<p>Redirecting to playstore...</p>',
})

export class DownloadRedirectComponent implements OnInit {
  private redirects = {
    androidapp: 'https://bit.ly/shopoliteRiders',  // for riders
    playstorelink: 'https://bit.ly/shopoliteInstaLink',  // for instagram marketing
    app: 'https://bit.ly/shopolite-all-in-one-ballari-app',   //for whatsapp shares 
    playstoreapplink: 'https://bit.ly/Shopolite-app-ballari-yt',   //for share common 

  };

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');
    const url = this.redirects[type];
    if (url) {
      window.location.href = url;
    } else {
      // Handle unknown redirect type (e.g., navigate to a not-found page)
      this.router.navigate(['/path/to/not-found']);
    }
  }
}
