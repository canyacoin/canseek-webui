import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import qs from 'qs';
const { URL } = environment;

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor() { }

  async changeCurrency(currency): Promise<any> {
    return await fetch(`${URL.changeCurrency}?${qs.stringify(currency)}`)
      .then(response => response.json())
      .catch(err => console.log('Err, changeCurrency: ', err));
  }
}
