import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { RecordBase } from '../models/record';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(records: RecordBase[] ) {
    let group: any = {};

    records.forEach(question => {
      group[question.Username] = question.Username ? new FormControl(question.Username || '', Validators.required)
                                              : new FormControl(question.Username || '');
    });
    return new FormGroup(group);
  }
}
