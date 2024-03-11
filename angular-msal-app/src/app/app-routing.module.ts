import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserUtils } from "@azure/msal-browser";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./profile/profile.component";
import { MsalGuard } from '@azure/msal-angular';
import { ProtectedComponent } from './protected/protected.component';
import { OpenComponent } from './open/open.component';

const routes: Routes = [
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [MsalGuard]
  },
  {
    path: "protected",
    component: ProtectedComponent,
    canActivate: [MsalGuard]
  }, 
  {
    path: "open",
    component: OpenComponent,
    canActivate: [MsalGuard]
  },
  {
    path: "",
    component: HomeComponent,
  },
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation:
        !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
          ? "enabledNonBlocking"
          : "disabled",
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
