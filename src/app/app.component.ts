import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'converter_client';
  usdRate: number = 0;
  eurRate: number = 0;
  amount1: number = 1;
  amount2: number = 1;
  currency1: string = 'UAH';
  currency2: string = 'UAH';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRates();
  }

  getRates() {
    const apiUrl = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
    this.http.get<any[]>(apiUrl).subscribe(
      (data: any[]) => {
        const usd = data.find(currency => currency.cc === 'USD');
        const eur = data.find(currency => currency.cc === 'EUR');
        this.usdRate = usd ? usd.rate : 0;
        this.eurRate = eur ? eur.rate : 0;
        this.errorMessage = '';
      },
      error => {
        console.error('Error fetching currency rates:', error);
        this.errorMessage = 'Error loading currency rates. Please try again later.';
      }
    );
  }

  convertCurrency() {
    let rate1 = this.getRate(this.currency1);
    let rate2 = this.getRate(this.currency2);

    if (this.currency1 === this.currency2) {
      this.amount2 = this.amount1;
    } else {
      this.amount2 = (this.amount1 * rate1) / rate2;
    }
  }

  getRate(currency: string): number {
    switch (currency) {
      case 'USD':
        return this.usdRate;
      case 'EUR':
        return this.eurRate;
      default:
        return 1;
    }
  }
}
