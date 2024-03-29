import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG,MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Contoso Bank';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  isAdmin = this.checkAdminRole()

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig, private broadcastService: MsalBroadcastService, private authService: MsalService) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })
  }

  login() {
    if (this.msalGuardConfig.authRequest){
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  logout() { // Add log out function here
    this.authService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200'
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  checkAdminRole(): boolean{
    var accounts = this.authService.instance.getAllAccounts();
    return accounts.length>0 && accounts[0].idTokenClaims.roles.includes("admin");
  }
}


//==============================

// Sign in using popup
// import { MsalService } from '@azure/msal-angular';
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   title = 'msal-angular-tutorial';
//   isIframe = false;
//   loginDisplay = false;

//   constructor(private authService: MsalService) { }

//   ngOnInit() {
//     this.isIframe = window !== window.parent && !window.opener;
//   }

//   login() {
//     this.authService.loginPopup()
//       .subscribe({
//         next: (result) => {
//           console.log(result);
//           this.setLoginDisplay();
//         },
//         error: (error) => console.log(error)
//       });
//   }

//   setLoginDisplay() {
//     this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
//   }
// }