import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';Chart.register(ArcElement, Tooltip, Legend);
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
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataset, ChartOptions,PieController } from 'chart.js';
Chart.register(PieController,ArcElement, Tooltip, Legend);
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
    BaseChartDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './calurator.component.html',
  styleUrl: './calurator.component.scss',
})
export class CaluratorComponent implements OnInit {
  form!: FormGroup;
  isResult!: boolean;

  expensePieChart: ChartDataset<'pie'> = {
    data: [],
    label: 'expense',
    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
  };

  public pieChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio:1,
  };

  pieChartDataset: ChartDataset[] = [];
  public pieChartLabels: string[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private fb: FormBuilder) {}

  @ViewChild(BaseChartDirective) expenseChart: BaseChartDirective | undefined;

  ngOnInit(): void {
    this.form = new FormGroup({
      income: new FormControl(0, Validators.required),
      result: new FormControl(0, Validators.required),
      expense: this.fb.array([]),
    });

    this.expenseArray.push(
      this.fb.group({
        expense: new FormControl(
          { value: null, disabled: false },
          Validators.required,
        ),
        value: new FormControl(0, Validators.required),
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
    this.pieChartDataset = []
    this.pieChartLabels = []
    this.expensePieChart.data = []
    this.expenseArray.controls.forEach((expense) => {
      this.form
        .get('result')
        ?.setValue(
          this.form.get('result')?.value -
            (expense as FormGroup).get('value')?.value,
        );
      this.expensePieChart.data.push(
        +(expense as FormGroup).get('value')?.value,
      );
      this.pieChartLabels.push((expense as FormGroup).get('expense')?.value);
    });
    this.pieChartDataset.push(this.expensePieChart);
    this.isResult = true;
  }

  deleteLesson(index: number) {
    const expense = +(this.expenseArray.at(index) as FormGroup).get('value')
      ?.value;
    if (!isNaN(expense)) {
      const currentResult = this.form.get('result')?.value || 0;
      this.form.get('result')?.setValue(currentResult + expense);
    }
    this.expenseArray.removeAt(index);
  }
}
