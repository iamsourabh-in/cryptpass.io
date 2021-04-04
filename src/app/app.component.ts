import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cryptpass';
  mainForm = new FormGroup({});
  plainText: string;
  encryptText: string;
  encPassword: string;
  decPassword: string;
  conversionEncryptOutput: string;
  conversionDecryptOutput: string;

  constructor() {

  }

  // method is used to encrypt and decrypt the text
  convertText(conversion: string) {
    if (conversion === 'encrypt') {
      const j = '[{ \'username\' : \'' + this.plainText.trim() + '\'}]';
      this.conversionEncryptOutput = CryptoJS.AES.encrypt(j, this.encPassword.trim()).toString();
    }
    else {

      this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);

      alert(JSON.parse(this.conversionDecryptOutput[0]["username"]));
    }
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.mainForm.value);
  }
}
