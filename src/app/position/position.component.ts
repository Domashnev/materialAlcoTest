import { Component, OnInit, Input } from '@angular/core';
import { IPosition, IProducts } from '../products.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {
  @Input() position: IPosition;
  public expanded: Boolean;

  product: IProducts;
  codeFormControl: FormControl = new FormControl('',Validators.pattern("^[0-9|a-z|A-Z]+$"));
  barcodeMessage: string='';
  selected;
  
  constructor() { 
  }

  ngOnInit() {
    this.product=this.position.product;
  }
  addBarcode(code:string){
    this.position.barcodeInfo.push(code); 
    this.barcodeMessage="Код добавлен в список"; 
    setTimeout(()=>{ this.barcodeMessage='' }, 3000);
  }
  deleteBarcode(code:string){
    this.position.barcodeInfo.splice(this.position.barcodeInfo.indexOf(code),1);
    this.barcodeMessage="Код удален из списка!"
    setTimeout(()=>{ this.barcodeMessage='' }, 3000);
  }
}
