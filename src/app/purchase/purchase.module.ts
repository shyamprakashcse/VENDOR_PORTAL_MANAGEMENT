import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfqComponent } from './rfq/rfq.component';
import { RouterModule,Routes } from '@angular/router';
import { PurchaseorderComponent } from './purchaseorder/purchaseorder.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FormsModule } from '@angular/forms';
import { PurchaseorderbillComponent } from './purchaseorderbill/purchaseorderbill.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PurchaseorderhistoryComponent } from './purchaseorderhistory/purchaseorderhistory.component';

const route:Routes=[
  {path:'',redirectTo:'rfq'},
  {path:'rfq',component:RfqComponent},
  {path:'purchaseorder',component:PurchaseorderComponent}

]

@NgModule({
  declarations: [
    RfqComponent,
    PurchaseorderComponent,
    PurchaseorderbillComponent,
    GoodsReceiptComponent,
    InvoiceComponent,
    PurchaseorderhistoryComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    OrderModule,
    FilterPipeModule,
    FormsModule,
    RouterModule.forChild(route)
  ]
})



export class PurchaseModule {
  constructor(){
    console.log("Purchase Module ");

   }
}
