import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";

import { Observable } from "rxjs";

import * as customerActions from "../state/customer.actions";
import * as fromCustomer from "../state/customer.reducer";
import { Customer } from "../customer.model";

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit {
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromCustomer.AppState>
  ) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      name: ["", Validators.required],
      phone: ["", Validators.required],
      address: ["", Validators.required],
      membership: ["", Validators.required],
      id: null
    })

    const customer$: Observable<Customer> = this.store.select(
      fromCustomer.getCurrentCustomer
    )

    customer$.subscribe(currentCustomer => {
      if (currentCustomer) {
        this.customerForm.patchValue({
          name: currentCustomer.nom,
          phone: currentCustomer.v_depart,
          address: currentCustomer.v_arrivee,
          membership: currentCustomer.date,
          id: currentCustomer.id
        });
      }
    })
  }

  updateOffer() {
    const updatedCustomer: Customer = {
      nom: this.customerForm.get("name").value,
      v_depart: this.customerForm.get("phone").value,
      v_arrivee: this.customerForm.get("address").value,
      date: this.customerForm.get("membership").value,
      id: this.customerForm.get("id").value
    };

    this.store.dispatch(new customerActions.UpdateCustomer(updatedCustomer))
  }

}
