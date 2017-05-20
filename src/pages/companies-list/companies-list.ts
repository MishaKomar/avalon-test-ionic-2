import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CompaniesService } from '../service/companies-service';
import { CompanyInfoPage } from '../company-info/company-info';
import { AlertController } from 'ionic-angular';
import { Company } from '../service/companies-service';



@Component({
  selector: 'page-companies-list',
  templateUrl: 'companies-list.html',
  providers: [CompaniesService]
})
export class CompaniesListPage {
	searchTerm: string = "";
	companies: Company[];

	constructor(public navCtrl: NavController, 
				public companiesService: CompaniesService,
				public alertCtrl: AlertController) {
		if (!companiesService.companies)
			companiesService.getCompanies().subscribe(data => {
		        this.companies = data;
		    });
	}
 
    setFilteredItems() {
    	this.companiesService.companies = this.companies;
        this.companiesService.companies = this.companiesService.filterItems(this.searchTerm);
    }

    ionViewDidLoad() {
        this.setFilteredItems();
    }
  	
  	itemTapped(event, company) {
		this.navCtrl.push(CompanyInfoPage, {
			company: company,
			companiesService: this.companiesService,
			chaceCompanies: this.companies
		});
	}

	addNewCompany(){
	    let prompt = this.alertCtrl.create({
	      title: 'Enter a name of the new company',
	      inputs: [
	        {
	          name: 'newCompanyName',
	          placeholder: 'Some name'
	        },
	      ],
	      buttons: [
	        {
	          text: 'Cancel',
	          handler: data => {
	            console.log('Add New Company: Cancel clicked');
	          }
	        },
	        {
	          text: 'Add',
	          handler: data => {
	            if (data.newCompanyName != ""){
	            	let newComp: Company = {
	            		companyName: data.newCompanyName,
	            		companyGoods: []
	            	};
	            	this.companiesService.addCompany(newComp).subscribe(
		            	data => {
	            			this.companiesService.companies.push(data.success);
	            			this.companies = this.companiesService.companies;
		            	}, error => {
		            		let alert = this.alertCtrl.create({
			                  title: "Can't add new company",
			                  subTitle: "Status:" + error.status,
			                  buttons: ["OK"]
			                });
			                alert.present();
		            		console.log("Can't add new company", error);
		            	}
		            );
	            }
	          }
	        }
	      ]
	    });
	    prompt.present();
  	}
}
