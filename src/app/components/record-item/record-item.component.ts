import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-record-item',
  templateUrl: './record-item.component.html',
  styleUrls: ['./record-item.component.css']
})
export class RecordItemComponent implements OnInit {
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  uploadedFiletext: string;
  conversionEncryptOutput: string = '';
  conversionDecryptOutput: string = '';
  profileForm = this.fb.group({
    mainpass: [''],
    aliases: this.fb.array([
      // this.fb.group({
      //   title: ['', Validators.required],
      //   username: ['', Validators.required],
      //   password: ['', Validators.required],
      //   URL: ['', Validators.required],
      //   note: ['', Validators.required],
      // })
    ])
  });

  constructor(private fb: FormBuilder) { }

  get aliases() {
    return this.profileForm.get('aliases') as FormArray;
  }
  addAlias() {
    this.aliases.push(this.fb.group({
      title: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      URL: ['', Validators.required],
      note: ['', Validators.required],
    }));
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.warn(this.profileForm.value);
    let userSecrets = JSON.stringify(this.profileForm.get('aliases').value);
    let mainPass = this.profileForm.get('mainpass') as FormControl
    console.warn(mainPass.value);
    this.conversionEncryptOutput = CryptoJS.AES.encrypt(userSecrets, mainPass.value).toString();
    console.warn();
    this.dyanmicDownloadByHtmlTag({
      fileName: 'secrets.cp',
      text: this.conversionEncryptOutput
    });
  }


  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  openFile(event) {


    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
      let reader = new FileReader();
      reader.onload = () => {
        // this 'text' is the content of the file

        this.uploadedFiletext = reader.result.toString();

        this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.uploadedFiletext, 'asd').toString(CryptoJS.enc.Utf8);

        console.log(this.conversionDecryptOutput);

        let formdata = JSON.parse(this.conversionDecryptOutput);
        formdata.forEach(element => {
          this.aliases.push(this.fb.group({
            title: [element.title, Validators.required],
            username: [element.username, Validators.required],
            password: [element.password, Validators.required],
            URL: [element.URL, Validators.required],
            note: [element.note, Validators.required],
          }));
        });
      }
      reader.readAsText(input.files[index]);
    };
  }

}
