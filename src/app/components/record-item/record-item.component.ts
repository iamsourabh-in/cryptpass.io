import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

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


  conversionEncryptOutput: string = '';

  profileForm = this.fb.group({
    mainpass: [''],
    aliases: this.fb.array([
      this.fb.group({
        title: ['title', Validators.required],
        username: ['', Validators.required],
        password: ['', Validators.required],
        URL: ['', Validators.required],
        note: ['', Validators.required],
      })
    ])
  });
  // formArray = new FormArray(this.profileForm.controls)
  constructor(private fb: FormBuilder) { }
  get aliases() {
    return this.profileForm.get('aliases') as FormArray;
  }
  addAlias() {
    this.aliases.push(this.fb.group({
      title: ['title', Validators.required],
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

}
