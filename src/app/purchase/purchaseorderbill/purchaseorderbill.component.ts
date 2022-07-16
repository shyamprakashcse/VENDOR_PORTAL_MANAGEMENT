import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-purchaseorderbill',
  templateUrl: './purchaseorderbill.component.html',
  styleUrls: ['./purchaseorderbill.component.css']
})
export class PurchaseorderbillComponent implements OnInit {

  print:any;
  @Input() selectedData : any ;

  TotalOrderedQuantity:number =0
  TotalGrossValue:number =0
  TotalNetValue:number =0
  TotalEffectiveValue:number =0


//   POBillData = [
//     {
//         "PURCAHSE_ORDER_NO": "4500000009",
//         "PURCHASE_ORDER_ITEM": "00010",
//         "PO_CHNG_DATE": "2022-06-08",
//         "MAT_NAME": "Robotic Arm",
//         "MAT_NO": "000000000000000104",
//         "MATN_NO": "000000000000000104",
//         "COMP_CODE": "0001",
//         "PLANT": "0002",
//         "STORAGE_LOC": "01MB",
//         "MAT_GRP": "01",
//         "PURCHASING_INFO_REC": "5300000001",
//         "TARGET_QTY": "0",
//         "TOT_QTY": "5.000",
//         "UNIT": "EA",
//         "NET_PRICE": "90.0000",
//         "PRICE_UNIT": "1",
//         "NET_VALUE": "450.0000",
//         "GROS_VALUE": "450.0000",
//         "QUOT_DEAD": "0000-00-00",
//         "PRICE_DATE": "2022-06-08",
//         "DOC_CAT": "F",
//         "EFFECTIVE_VAL": "436.5000",
//         "RFQ": "",
//         "RFQ_ITEM": "00000"
//     },
//     {
//         "PURCAHSE_ORDER_NO": "4500000009",
//         "PURCHASE_ORDER_ITEM": "00020",
//         "PO_CHNG_DATE": "2022-06-08",
//         "MAT_NAME": "Robotic Arm",
//         "MAT_NO": "000000000000000104",
//         "MATN_NO": "000000000000000104",
//         "COMP_CODE": "0001",
//         "PLANT": "0002",
//         "STORAGE_LOC": "02MB",
//         "MAT_GRP": "01",
//         "PURCHASING_INFO_REC": "5300000001",
//         "TARGET_QTY": "0",
//         "TOT_QTY": "9.000",
//         "UNIT": "EA",
//         "NET_PRICE": "90.0000",
//         "PRICE_UNIT": "1",
//         "NET_VALUE": "810.0000",
//         "GROS_VALUE": "810.0000",
//         "QUOT_DEAD": "0000-00-00",
//         "PRICE_DATE": "2022-06-08",
//         "DOC_CAT": "F",
//         "EFFECTIVE_VAL": "785.7000",
//         "RFQ": "",
//         "RFQ_ITEM": "00000"
//     },
//     {
//         "PURCAHSE_ORDER_NO": "4500000009",
//         "PURCHASE_ORDER_ITEM": "00030",
//         "PO_CHNG_DATE": "2022-06-08",
//         "MAT_NAME": "test material 1",
//         "MAT_NO": "000000000000000103",
//         "MATN_NO": "000000000000000103",
//         "COMP_CODE": "0001",
//         "PLANT": "0002",
//         "STORAGE_LOC": "01MB",
//         "MAT_GRP": "01",
//         "PURCHASING_INFO_REC": "5300000000",
//         "TARGET_QTY": "0",
//         "TOT_QTY": "4.000",
//         "UNIT": "EA",
//         "NET_PRICE": "833.3300",
//         "PRICE_UNIT": "1",
//         "NET_VALUE": "3333.3200",
//         "GROS_VALUE": "3333.3200",
//         "QUOT_DEAD": "0000-00-00",
//         "PRICE_DATE": "2022-06-08",
//         "DOC_CAT": "F",
//         "EFFECTIVE_VAL": "3233.3200",
//         "RFQ": "",
//         "RFQ_ITEM": "00000"
//     }
// ]

POBillData:any=[]
 private _PayLoadURL = "http://localhost:3000/api/payload"
 private _PODetailURL = "http://localhost:3000/api/podetail"
 private _PayLoadBody = {
  "token":localStorage.getItem('token')
 }

 private _PODetailBody = {
    "PurchaseOrderNo" : ""
 }

 OrgData :any ;
  constructor(private http:HttpClient) {

  }

  ngOnInit(): void {

    this._PODetailBody["PurchaseOrderNo"] = this.selectedData

    this.http.post<any>(this._PODetailURL,this._PODetailBody).subscribe((res)=>{
      this.POBillData = res
      console.log(this.POBillData);
      this.findSum();
    },(err)=>{
       console.log(err);
    })


    this.http.post<any>(this._PayLoadURL,this._PayLoadBody).subscribe((res)=>{

       this.OrgData = res
    },(err)=>{
      console.log(err)
    });





  }


  ExportPDF(){


    this.print = document.getElementById('print');
    //var width = document.getElementById('print').offsetWidth;
    html2canvas(this.print).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      var position = 5;
      pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth-7, imgHeight)
      pdf.save('PurchaseOrderMemo.pdf');
     })


  }

  findSum(){
    this.POBillData.forEach((value:any, index:any) => {
          this.TotalOrderedQuantity+=parseFloat(value["TOT_QTY"]);
          this.TotalGrossValue+=parseFloat(value["GROS_VALUE"]);
          this.TotalNetValue+=parseFloat(value["NET_VALUE"]);
          this.TotalEffectiveValue+=parseFloat(value["EFFECTIVE_VAL"])
    })
  }


}
