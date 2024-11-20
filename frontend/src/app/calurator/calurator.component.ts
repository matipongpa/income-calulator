import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-calurator',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './calurator.component.html',
  styleUrl: './calurator.component.scss',
})
export class CaluratorComponent implements OnInit {
  form!: FormGroup;
  isResult!: boolean;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      income: new FormControl(
        { value: null, disabled: false },
        Validators.required,
      ),
      result: new FormControl(
        { value: null, disabled: false },
        Validators.required,
      ),
      expense: this.fb.array([]),
    });

    this.expenseArray.push(
      this.fb.group({
        expense: new FormControl(
          { value: null, disabled: false },
          Validators.required,
        ),
        value: new FormControl(
          { value: null, disabled: false },
          Validators.required,
        ),
      }),
    );
  }

  get expenseArray() {
    return this.form.get('expense') as FormArray;
  }

  onClickPlus() {
    this.expenseArray.push(
      this.fb.group({
        expense: new FormControl(
          { value: null, disabled: false },
          Validators.required,
        ),
        value: new FormControl(
          { value: null, disabled: false },
          Validators.required,
        ),
      }),
    );
  }

  onClickCalcurate() {
    const income = this.form.get('income')?.value;
    this.form.get('result')?.setValue(income);
    if (!this.form.valid) {
      return;
    }
    this.expenseArray.controls.forEach((expense) => {
      this.form
        .get('result')
        ?.setValue(
          this.form.get('result')?.value -
            (expense as FormGroup).get('value')?.value,
        );
    });
    this.isResult = true;
  }

  deleteLesson(index: number) {
    this.expenseArray.removeAt(index);
  }
}
