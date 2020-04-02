import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { IProducts, IHeader, IPosition, IDocument, IChargeOn } from './products.model';
import { Observable } from 'rxjs';
import { PositionComponent } from './position/position.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  @ViewChildren(PositionComponent) positionComponentChildren: QueryList<PositionComponent>;
 
  jsonUrl:string= "https://my-json-server.typicode.com/domashnev/alcotest/products/";
  //"/assets/vodka.json";

  initHeader: IHeader=<IHeader>{number:'',actDate: new Date(), typeChargeOn:'Маркированная продукция' };
  testBarcodes=[
    "101100000000750118001D5CCFC794963898C1B13E41231CKY42T7UDIJJY2AWLHS7HPGINLMY7PQPDNJALVS42WNCHYRCO257SPCSCF4ASM37BZNTLIASYRVGFUTCXDXDJPML5NNVA0B00000001",
    "101100000000750118001D5CCFC794963898C1B13E41231CKY42T7UDIJJY2AWLHS7HPGINLMY7PQPDNJALVS42WNCHYRCO257SPCSCF4ASM37BZNTLIASYRVGFUTCXDXDJPML5NNVA0B00000002",
    "101100000000750118001D5CCFC794963898C1B13E41231CKY42T7UDIJJY2AWLHS7HPGINLMY7PQPDNJALVS42WNCHYRCO257SPCSCF4ASM37BZNTLIASYRVGFUTCXDXDJPML5NNVA0B00000003"
  ];

  productControl: FormControl = new FormControl('', Validators.required);
  closePanel: string;

  header: IHeader=this.initHeader;
  allPositions:IPosition[]=[];
  selectedPositions: IPosition[]=[];
  selected;

  resultXML: string;
  resultXMLFileUrl: SafeResourceUrl;

  constructor(private http: HttpClient,private sanitizer: DomSanitizer){
  };

  getProducts():Observable<IProducts[]>{
    return this.http.get<IProducts[]>(this.jsonUrl);
  }

  ngOnInit(){
    this.getProducts().subscribe(data => {
      for(let i=0; i<data.length; i++){
          let pos: IPosition={identity: i+1, product: data[i], quantity: 0, barcodeInfo:[]}
          if(i<2){
            pos.quantity=405050+i*11;
            pos.barcodeInfo=this.testBarcodes.slice();
          }
         this.allPositions.push(pos);
      }         
    });
  }
  
  selectPosition(pos: IPosition[]){
    this.selectedPositions=pos;
  }

  onSubmit() {
    this.closePanel="YES";
    //position.identity - порядковый номер позиции ???
    for(let i=0; i <this.selectedPositions.length; i++){
      this.selectedPositions[i].identity=i+1;
    }
    let doc: IDocument=<IDocument>{};
    let chargeOn: IChargeOn=<IChargeOn>{};
    chargeOn.header=this.header;
    chargeOn.content=this.selectedPositions;
    doc.chargeOn=chargeOn;

    this.resultXML = this.formatXml('<document>'+this.OBJtoXML(doc)+'</document>','  ');
    console.log(this.resultXML);
    this.setDownloadLink();

    this.positionComponentChildren.forEach((child) => { 
        if (child.expanded) child.expanded=false; 
     });
  }

  clearForm(f: NgForm){
    f.resetForm();
    this.resultXML=''; 
    this.productControl.reset();
    this.selectedPositions.splice(0);
  }

 OBJtoXML(obj: Object) {
  let xml = '';
  for (var prop in obj) {
    //xml += obj[prop] instanceof Array ? '' : "\t<" +  prop + ">\n";
    xml += "<" +  prop + ">";
    if (obj[prop] instanceof Array) {
      for (var array in obj[prop]) {
        let propInArray='?';
        if(prop=='barcodeInfo') propInArray= 'code';
        if(prop=='content') propInArray='position';
        xml += "<" + propInArray + ">";
        xml += this.OBJtoXML(new Object(obj[prop][array]));
        xml += "</" + propInArray + ">";
      }
    } else if (obj[prop] instanceof  Date) {
      xml += obj[prop].toISOString().slice(0,10);
    } else if (typeof obj[prop] == "object") {
      xml += this.OBJtoXML(new Object(obj[prop]));
    } else {
      xml +=  obj[prop];    
    }
    //xml += obj[prop] instanceof Array ? '' : "\t</" + prop + ">\n";
    xml += "</" +  prop + ">";
  }
  xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
  return xml
  }

  formatXml(xml:string, tab:string) { 
    var formatted = '', indent= '';
    tab = tab || '\t';
    xml.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
    });
    return formatted.substring(1, formatted.length-3);
  }

  setDownloadLink() {
    const data = '<?xml version="1.0" encoding="utf-8"?>\n'+ this.resultXML;
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.resultXMLFileUrl= this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

}
