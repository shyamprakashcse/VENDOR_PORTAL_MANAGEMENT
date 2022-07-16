import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.css']
})
export class RfqComponent implements OnInit {

  private _RFQDataURL = "http://localhost:3000/api/rfq"

  page:number=1;
  orderField:string='';
  doc:any;
  reverseSort:boolean=false;
  print : any ;
  UserId:any;
  RFQBody={}
  searchInput:any= {
    "PURCHASE_ORDER_NO": "",
    "COMPANY_CODE": "",
    "PURCHASE_DOC_CATAGORY": "",
    "PURCHASE_DOC_TYPE": "",
    "STATUS": "",
    "PURCHASE_ORDER_CREATED_DATE": "",
    "VENDOR_NO": "",
    "CUSTOMER_NO": "",
    "PURCHASE_ORGANISATION": "",
    "PURCHASE_GROUP": "",
    "PURCHASE_DOC_DATE": "",
    "BID_LAST_DATE": ""
}
  RFQData:any=[]

  constructor(private http:HttpClient,private route:Router,private loader:NgxSpinnerService) { }

  ngOnInit(): void {
    this.loader.show(undefined,{
      type: "ball-climbing-dot",
      color:'#0f1aec',
      size:'large',
      fullScreen:false,

      bdColor:'rgba(100,149,237,0.1)',

    });

    this.UserId=localStorage.getItem('id');
    this.RFQBody={
      "VendorID" : this.UserId
    }
    this.http.post<any>(this._RFQDataURL,this.RFQBody).subscribe((res)=>{
      console.log(res);
      this.loader.hide();
      this.RFQData = res
      Swal.fire({
        icon: 'success',
        title: 'Data found',
        text: 'Inquiry Data is Found!...',
        timer : 2000

      })

    },(err)=>{
      console.log(err);
      this.loader.hide();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No Data is Found!...',
        timer : 2000

      })


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
      pdf.save('RequestQuotation.pdf');
     })




  }



  sortHeader(sortField:string){
    this.orderField=sortField;
    if(this.reverseSort==true)
    {
      this.reverseSort=false;
    }
    else{
      this.reverseSort=true;
    }
  }


  backToHome(){
    this.route.navigate(['home'])
  }

}
