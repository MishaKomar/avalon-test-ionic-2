import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Company } from '../service/companies-service';

@Component({
  selector: 'company-info',
  templateUrl: 'company-info.html'
})
export class CompanyInfoPage {

	company: Company;	
	companiesService: any;

	constructor(public navCtrl: NavController, 
      				private navParams: NavParams, 
      				public actionSheetCtrl: ActionSheetController,
      				public alertCtrl: AlertController
      				) {
		this.company = navParams.get('company');
		this.companiesService = navParams.get('companiesService');
	}

	private deleteCompany(company: Company){
  	if(this.companiesService.companies.length && company){
  		let index = this.companiesService.companies.indexOf(company);
  		if (index > -1)
  			this.companiesService.companies.splice(index, 1);
  	}
	}
  private deleteGoods(goods: string){
    if(this.company.companyGoods.length){
      let index = this.company.companyGoods.indexOf(goods);
      if (index > -1)
        this.company.companyGoods.splice(index, 1);
    }
  }

	presentActionSheet(company: Company) {
    let actionSheet = this.actionSheetCtrl.create({
      title: company.companyName,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
            this.showDeteleCompanyAlert(company);
          }
        },{
          text: 'Rename',
          handler: () => {
            console.log('Rename clicked');
            this.showRenameCompanyAlert(company);
          }
        },{
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  showRenameCompanyAlert(company: Company) {
    let prompt = this.alertCtrl.create({
      title: 'Enter a new name for this company',
      inputs: [
        {
          name: 'newCompanyName',
          placeholder: company.companyName
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            if (data.newCompanyName != "" && data.newCompanyName != company.companyName){
              let oldCompanyName = company.companyName; 
              company.companyName = data.newCompanyName; 
            	this.companiesService.changeCompany(oldCompanyName, company).subscribe(
	            	data => {
                  // come code
	            	}, error => {
                  company.companyName = oldCompanyName;
                  console.log("Can't rename this company", error);
                  this.showOkAlert({
                    title: "Can't rename this company",
                    subTitle: "Status:" + error.status,
                    buttonName: "OK"
                  });
	            	}
	            );
            }
          }
        }
      ]
    });
    prompt.present();
  }

   showDeteleCompanyAlert(company: Company) {
    let confirm = this.alertCtrl.create({
      title: 'Do you agree to delete this company?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Agree clicked');
            this.companiesService.deleteCompany(company.companyName).subscribe(
            	data => {
            		this.deleteCompany(company);
                this.navCtrl.pop();
            	}, error => {
            		console.log("Can't delete company, ", error);
                this.showOkAlert({
                  title: "Can't delete this company",
                  subTitle: "Status:" + error.status,
                  buttonName: "OK"
                });
            	}
            );
          }
        }
      ]
    });
    confirm.present();
  }

  showAddNewGoodsAlert(){
    let prompt = this.alertCtrl.create({
      title: 'Enter a name of the new goods',
      inputs: [
        {
          name: 'newGoodsName',
          placeholder: 'Some name'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.newGoodsName != ""){
              this.company.companyGoods.push(data.newGoodsName);
              this.companiesService.changeCompany(this.company.companyName, this.company).subscribe(
                data => {
                  // come code
                }, error => {
                  this.deleteGoods(data.newGoodsName);
                  console.log("Can't add new goods", error);
                  this.showOkAlert({
                    title: "Can't add new goods",
                    subTitle: "Status:" + error.status,
                    buttonName: "OK"
                  });
                }
              );
            }
          }
        }
      ]
    });
    prompt.present();
  }

  deleteGoodsItem(goods){
    this.deleteGoods(goods);
      this.companiesService.changeCompany(this.company.companyName, this.company).subscribe(
        data => {
          // come code
        }, error => {
          this.company.companyGoods.push(goods);
          console.log("Can't delete goods", error);
          this.showOkAlert({
            title: "Can't delete goods",
            subTitle: "Status:" + error.status,
            buttonName: "OK"
          });
        }
      );
  }

  private showOkAlert(alertInfo){
    let alert = this.alertCtrl.create({
      title: alertInfo.title,
      subTitle: alertInfo.subTitle,
      buttons: [alertInfo.buttonName]
    });
    alert.present();
  }
}
