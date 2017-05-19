import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
 
const DOMAIN = "http://avalon.avalonfaltd.com";
const PORT = ":3090"

export class Company {
  constructor (public companyName: string,
               public companyGoods: string[]){
  }
};

export class CompaniesService {  

  static get parameters() {
    return [[Http]];
  }

  constructor(private http:Http, public companies: Company[]) {
  }

  filterItems(searchTerm){
    if (this.companies){
      return this.companies.filter((company) => {
          if (company.companyName){
            let a = company.companyName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            let b = false;
            if (company.companyGoods && company.companyGoods.length){
              for (let i = 0; i < company.companyGoods.length; i++) {
                b = b || company.companyGoods[i].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;  
              }
            }
            return a || b;
          }
      });  
    }   
  }

  public getCompanies() {
    return this.http.get(DOMAIN + PORT + "/companies")
      .map(res => res.json())
      .map(data => {
        this.companies = data.success;
        return this.companies;
      }, err => {
        console.log("Get companies error");
      });
  }

  public getCompany(name: string){
    return this.http.get(DOMAIN + PORT + "/companies/" + name).map(res => res.json());
  }

  public addCompany(company: Company){
    return this.http.post(DOMAIN + PORT + "/companies", company).map(res => res.json());
  }

  public deleteCompany(name) {
    return this.http.delete(DOMAIN + PORT + "/companies/" + name).map(res => res.json());
  }

  public changeCompany(oldCompanyName: string, company: Company){
    return this.http.put(DOMAIN + PORT + "/companies/" + oldCompanyName, company).map(res => res.json());
  }

}