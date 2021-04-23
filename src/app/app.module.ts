import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomFormsModule } from 'ng2-validation'
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { UserDataService } from './Services/UserDataService';

import { RequestService } from './Services/RequestService';

import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import  {File, IWriteOptions} from '@ionic-native/file/ngx';
import  {FileOpener}  from '@ionic-native/file-opener/ngx';
@NgModule({
  declarations: [
    AppComponent,

  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    CustomFormsModule,
    Ng2SearchPipeModule,
    FormsModule
  ],
  providers: [
    StatusBar,
    UserDataService,
    RequestService,
    SplashScreen,
    FileOpener,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide:'AMBI_API_URL',useValue:environment.url}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
