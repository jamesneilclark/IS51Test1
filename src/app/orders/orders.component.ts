import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlexModalService } from '../shared-components/flex-modal/flex-modal.service';
import { Http } from '@angular/http';

interface IOrder {
  pid: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  orders: Array<IOrder> = [];
  name = '';
  errorMessage = '';
  confirmMessage = '';
  constructor(
    private router: Router,
    private flexModal: FlexModalService,
    // tslint:disable-next-line: deprecation
    private http: Http
  ) {

  }

  async ngOnInit() {
    this.loadDefaultOrders();
  }
  calculate() {
    const total = this.orders.reduce((inc, item, i, arr) => {
      inc += item.price * item.quantity;
      return inc;
    }, 0);
    const taxAmount = total * .1;
    const subTotal = total - taxAmount;
    return {
      total: total,
      taxAmount: taxAmount,
      subTotal: subTotal
    };
  }
  loadDefaultOrders() {
    this.orders = [{
      'pid': '1',
      'image': 'assets/sm_android.jpeg',
      'description': 'Android',
      'price': 150.00,
      'quantity': 2
    }, {
      'pid': '2',
      'image': 'assets/sm_iphone.jpeg',
      'description': 'IPhone',
      'price': 200.00,
      'quantity': 2
    }, {
      'pid': '3',
      'image': 'assets/sm_windows.jpeg',
      'description': 'Windows Phone',
      'price': 110.00,
      'quantity': 2
    }];
  }

  delete(index: number) {
    this.orders.splice(index, 1);
  }

  addItem(item: string) {
    switch (item) {
      case 'android':
        this.orders.unshift({
          'pid': '1',
          'image': 'assets/sm_android.jpeg',
          'description': 'Android',
          'price': 150.00,
          'quantity': null
        });
        break;

      case 'iPhone':
        this.orders.unshift({
          'pid': '2',
          'image': 'assets/sm_iphone.jpeg',
          'description': 'IPhone',
          'price': 200.00,
          'quantity': null
        });

        break;
      case 'windowsPhone':
        this.orders.unshift({
          'pid': '3',
          'image': 'assets/sm_windows.jpeg',
          'description': 'Windows Phone',
          'price': 110.00,
          'quantity': null
        });

        break;
    }
  }

  submit() {
    let error = false;
    const commaIndex = this.name.indexOf(', ');

    if (this.name === '') {
      this.errorMessage = 'Name must not be empty';
      error = true;
    } else if (commaIndex === -1) {
      this.errorMessage = 'Name must have a comma!';
      error = true;
    }

    if (!error) {
      const firstName = this.name.slice(commaIndex + 1, this.name.length);
      const lastName = this.name.slice(0, commaIndex);
      const fullName = firstName + ' ' + lastName;
      const calculation = this.calculate();
      this.confirmMessage = `Thank you for your order ${fullName}. Your subtotal is: $${calculation.total - calculation.taxAmount}. Your tax amount is: $${calculation.taxAmount}.
      Your grand total is: $${calculation.total}.`;
      this.flexModal.openDialog('confirm-modal');
    } else {
      this.flexModal.openDialog('error-modal');
    }

  }
  clear() {
    this.orders = [];
  }
}
