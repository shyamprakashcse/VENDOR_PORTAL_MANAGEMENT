import { Component, OnInit ,Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.css']
})
export class GoodsReceiptComponent implements OnInit {

  print:any;
  @Input() selectedData:any;

  private _GoodsReceiptURL = 'http://localhost:3000/api/goodsbill'
  private _GoodsReceiptBody = {
    "PurchaseOrderNo":""
  }

  TotalEnterQuant:number =0
  TotalPOQuant:number = 0

//   GoodsHeader:any = {
//     "MAT_DOC_NO" : "4500000003",
//     "DOC_YEAR" : "2022",
//     "DOC_DATE" : "2022-06-08",
//     "PSTNG_DATE" : "2022-07-05",
//     "ENTRY_DATE" : "2022-08-08",
//     "ENTRY_TIME" : "00.00.00"
//   }

//   GoodsItem:any=[

//     {
//       "MAT_DOC" : "5000000001",
//       "DOC_YEAR"  :"2022",
//       "MATDOC_ITM":"0001",
//       "MATERIAL" :"103",
//       "PLANT"  :"0002",
//       "STORAGE_LOC":"01MB",
//       "MOVEMENT_TYP":"101",
//       "ENTRY_QUANT" :"55,000",
//       "ENTRY_UOM" :"10",
//       "ENTRY_UOM_ISO":"22",
//       "PO_PR_QNT":"55,000",
//       "ORDERPR_UN" :"2",
//       "ORDERPR_UN_ISO" :"3",
//       "PO_NUMBER" :"4500000003",
//       "PO_ITEM" :"00010",
//   },
//   {
//     "MAT_DOC" : "5000000001",
//     "DOC_YEAR"  :"2022",
//     "MATDOC_ITM":"0001",
//     "MATERIAL" :"103",
//     "PLANT"  :"0002",
//     "STORAGE_LOC":"01MB",
//     "MOVEMENT_TYP":"101",
//     "ENTRY_QUANT" :"55,000",
//     "ENTRY_UOM" :"10",
//     "ENTRY_UOM_ISO":"22",
//     "PO_PR_QNT":"55,000",
//     "ORDERPR_UN" :"2",
//     "ORDERPR_UN_ISO" :"4",
//     "PO_NUMBER" :"4500000003",
//     "PO_ITEM" :"00010",
// } ,
// {
//   "MAT_DOC" : "5000000001",
//   "DOC_YEAR"  :"2022",
//   "MATDOC_ITM":"0001",
//   "MATERIAL" :"103",
//   "PLANT"  :"0002",
//   "STORAGE_LOC":"01MB",
//   "MOVEMENT_TYP":"101",
//   "ENTRY_QUANT" :"55,000",
//   "ENTRY_UOM" :"10",
//   "ENTRY_UOM_ISO":"22",
//   "PO_PR_QNT":"55,000",
//   "ORDERPR_UN" :"2",
//   "ORDERPR_UN_ISO" :"4",
//   "PO_NUMBER" :"4500000003",
//   "PO_ITEM" :"00010",
// } ,
// {
//   "MAT_DOC" : "5000000001",
//   "DOC_YEAR"  :"2022",
//   "MATDOC_ITM":"0001",
//   "MATERIAL" :"103",
//   "PLANT"  :"0002",
//   "STORAGE_LOC":"01MB",
//   "MOVEMENT_TYP":"101",
//   "ENTRY_QUANT" :"55,000",
//   "ENTRY_UOM" :"10",
//   "ENTRY_UOM_ISO":"22",
//   "PO_PR_QNT":"55,000",
//   "ORDERPR_UN" :"2",
//   "ORDERPR_UN_ISO" :"43",
//   "PO_NUMBER" :"4500000003",
//   "PO_ITEM" :"00010",
// }


// ]

GoodsHeader:any={}
GoodsItem:any=[]
private _PayLoadURL = "http://localhost:3000/api/payload"
private _PayLoadBody = {
 "token":localStorage.getItem('token')
}

OrgData:any={
}

DisplayStatus:boolean=true

  constructor(private http:HttpClient,private loader:NgxSpinnerService) { }

  ngOnInit(): void {

    this.loader.show(undefined,{
      type: "ball-climbing-dot",
      color:'#0f1aec',
      size:'large',
      fullScreen:false,

      bdColor:'rgba(100,149,237,0.1)',

    });

    this._GoodsReceiptBody['PurchaseOrderNo']=this.selectedData
    this.http.post<any>(this._GoodsReceiptURL,this._GoodsReceiptBody).subscribe((res)=>{
      this.loader.hide();
      console.log(res)

      Swal.fire({
        icon: 'success',
        title: 'Goods Receipt found',
        text: 'GR Data is Found!...',
        timer : 2000

      })
      this.GoodsHeader = res[0];
      this.GoodsItem = res[1];
      if(this.GoodsHeader==null || this.GoodsItem[1]["MAT_DOC"]==""){
        this.DisplayStatus=false;

        Swal.fire({
          icon: 'error',
          title: 'Goods Receipt has Empty Data found',
          text: 'GR Data is Found Empty Reciept!...',
          timer : 2000

        })
      }
      else{
        this.DisplayStatus=true;
      }
      console.log(this.GoodsItem)
      this.calcQuant();
    },(err)=>{
      this.loader.hide();
      console.log(err);
      this.DisplayStatus=false
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No Data is Found!...',
        timer : 2000

      })
    });


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
    let pdf = new jspdf.jsPDF('p', 'mm', 'a3');
    var position = 5;
    pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth-7, imgHeight)
    pdf.save('GoodsReceipt.pdf');
   })
}

calcQuant(){
  this.GoodsItem.forEach((value:any) => {

    this.TotalPOQuant+=parseFloat(value['PO_PR_QNT']);
    this.TotalEnterQuant+=parseFloat(value['ENTRY_QUANT'])

  })
}


}
