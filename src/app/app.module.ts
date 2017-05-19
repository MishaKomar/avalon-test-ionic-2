import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CompaniesListPage } from '../pages/companies-list/companies-list';
import { CompanyInfoPage } from '../pages/company-info/company-info';

@NgModule({
  declarations: [
    MyApp,
    CompaniesListPage,
	  CompanyInfoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CompaniesListPage,
	  CompanyInfoPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
