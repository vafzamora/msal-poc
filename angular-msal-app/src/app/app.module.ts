import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { 
  MsalModule, 
  MsalRedirectComponent, 
  MsalGuard,
  MsalInterceptor
} from '@azure/msal-angular';

import { 
  PublicClientApplication, 
  InteractionType 
} from '@azure/msal-browser';
import { ProtectedComponent } from './protected/protected.component';
import { OpenComponent } from './open/open.component';

const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    ProtectedComponent,
    OpenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth:{
          clientId: "efb773aa-be5e-404b-9ad9-999498bbf544",
          authority: "https://login.microsoftonline.com/c11e98a0-f809-4ddf-ad63-58819e62e734",
          redirectUri: "http://localhost:4200"
        },
        cache:{
          cacheLocation: "localStorage",
          storeAuthStateInCookie: isIE
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ["user.read"]
        }
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
          ["http://localhost:5224/*",["api://592392bd-7ce7-49a2-8758-794f6de1d3e5/api-access"]],
        ])
      }
    )
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi:true
    },
    MsalGuard,
  ],
  bootstrap: [AppComponent,MsalRedirectComponent]
})
export class AppModule { }
