import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { FormBuilder, FormGroup ,Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ListtodoService } from '../listtodo.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  date;
  mode;
  dataSources ;
  done;
  errMessage;
  constructor(  
      private authService: AuthService,
      private router: Router,
      private dragula: DragulaService, 
      private _formBuilder: FormBuilder,
      public dialog: MatDialog ,
      private listtodoservice:ListtodoService ) {
        //dragla intiatsation par option 
      this.mode ="side";
      dragula.setOptions('bag-task1', {
      removeOnSpill: false
      });
      }


shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

// get and  update table todo 
updateTableTodo () {
  let iduser = this.listtodoservice.useJwtHelper();
  this.listtodoservice.getTodos(iduser).subscribe((res)=>{
  this.dataSources = res;
  console.log(this.dataSources);});
  }
  //  get date de  creation   
  getDate(){

   this.date= new Date().getDate().toString()+"/"+new Date().getDay().toString()+"/"+new Date().getFullYear().toString();
   return this.date;
  }

//modale d'ajout  list  task/todo  image  
// selon  le  type 
openDialog(type): void {

  if( type  === "list") {
    let dialogRef = this.dialog.open(FormtodolistComponent, {
      width: '40%',
          data: { 
          type:"list"     
           
            }
          });

      dialogRef.afterClosed().subscribe(result => {
        this.updateTableTodo ();
        });
  } 
  if( type  === "image") {
    let dialogRef = this.dialog.open(FormtodolistComponent, {
      width: '40%',
          data: { type:"image"}});
          dialogRef.afterClosed().subscribe(result => { 
          console.log(result);
            
        this.updateTableTodo ();});
   } 
  if( type  === "todo") {
  this.done=false;
  this.date= this.getDate();

  console.log(this.date)
  let dialogRef = this.dialog.open(FormtodolistComponent, {
    width: '60%',
    data: { 
      type:"todo",
      done:this.done,
      date:this.date
      }
  });

  dialogRef.afterClosed().subscribe(result => {
  let  iduser =this.listtodoservice.useJwtHelper();
      result={  
        id:iduser,
        task:{
          title:result.title,
          description:result.description,
          done:result.done,
          date:result.date,
          type:result.type,
          param: result.title+"todo"+iduser

       }
      };
    console.log('The dialog was closed', result);
    this.listtodoservice.addTodo(result)
        .subscribe((res) => {
          if (res === true) {
          //  this.router.navigateByUrl('');
            this.updateTableTodo();
          } else {
            this.errMessage = res;
          }
        });
      });
  
   } 
    
 }
  // modale de  modification et de supression   task/modal  list image

  openDialogItem(item,i): void {
    console.log(i);
    console.log(item);
    let dialogRef = this.dialog.open(ItemlistComponent, {
        width: '40%',
        data:{
          title:item.title,
          description:item.description,
          done:true,
          date:item.date,
          type:item.type,
          param:item.param,
          url_img :item.url_img,
          name:item.name,
          list:item.list ,
          position: i ,
          delete: false
        } 
        
      });
        dialogRef.afterClosed().subscribe(result => {
      let iduser = this.listtodoservice.useJwtHelper();
      console.log(result.delete);
      //// if  cheked  true delete  with type
      if (result.delete ===true){
        //delete  task/todo
        if(result.type === "todo") {
          this.listtodoservice.deleteTaskAndList(result,iduser).subscribe(result => { 
            console.log(result);
            this.updateTableTodo ();});
        }
          // delete task/todo  list 
        if(result.type ==="list"){
           this.listtodoservice.deleteTaskAndList(result,iduser).subscribe(result => { 
           console.log(result);
           this.updateTableTodo ();});
        }
         // delete  task image 
        if(result.type==="img"){
          this.listtodoservice.deleteImage(result,iduser).subscribe(result => { 
          this.updateTableTodo ();});
        }
      }else{
        // update   task/todo  image list
        
          let iduser = this.listtodoservice.useJwtHelper();
          this.listtodoservice.updateAnyTask(result,iduser)
          .subscribe((res) => {
            this.updateTableTodo();
            if (res === true) {
            
            //  this.router.navigateByUrl('');
              this.updateTableTodo();
            } else {
              this.errMessage = res;
            }
          });
       } 
     });
    }   
  ngOnInit() {
    this.updateTableTodo ();
  }
  onClickLogout() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }
}
// component modale  ajout list  task/todo image
@Component({
  selector: 'formtodo',
  templateUrl:'formtodo.html',
  styleUrls: ['formtodo.css']
})
export class FormtodolistComponent {
////todo variable
isLinear ;
nametodoFormGroup: FormGroup;
descriptionFormGroup: FormGroup;
  ////liste variable
  item;
  listinputs:any;
  listitems: any = [];
  title:string;
  id;
  done:boolean;
  date:any;
  errMessage = "" ;
  path;
  constructor(
     private router: Router,private listtodoService: ListtodoService,
    public dialogRef: MatDialogRef<FormtodolistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ,private _formBuilder: FormBuilder) {
      this.isLinear=true;
     }
     //image  fct 

  fctimage(event){
   
      this.id = this.listtodoService.useJwtHelper();
      this.done=false;
      this.date= new Date().getDate().toString();
      let file = event.target.files[0];
      console.log(event.target.files[0].name)
      
      let formData = new FormData();
      formData.append('id',this.id);
      formData.append('title',this.title);
      formData.append('done','false');
      formData.append('type','image');
      formData.append('date',this.date);
      formData.append('name',file.name);
      formData.append('param',this.title+"image"+this.id);
      formData.append('task_pic',file,file.name);
      console.log(formData);

      this.listtodoService.uploadAnswer(formData).subscribe((res) => {  console.log(res);});
      this.path="assets/uploads/pp.gif";
    }
  
  onNoClick(): void {
    this.dialogRef.close();
  
  }
  //construction de la liste de todo/tasks  
  addinput(value){
    if (value ==="") {

    }else {
      this.listitems.push({item:value,done:false});
      console.log(this.listitems);
      this.item="";
     }
  }
  //ajout de  la list  avec  service 
  confiraddlist(){
    this.id = this.listtodoService.useJwtHelper();
    this.done=false;
    this.date= new Date();

    console.log(this.title);
  
      this.listinputs= {"id": this.id, "task": {
      "type": "list",
      "title": this.title,
      "done": false, 
      "date": this.date,
      "list": this.listitems,
      "param":this.title+"list"+this.id
    }};
    console.log("list"+ JSON.stringify(this.listinputs));
    console.log("comme elle est "+this.listinputs.value);
    this.listtodoService.addTodo(this.listinputs)
      .subscribe((res) => {
        if (res === true) {
        //  this.router.navigateByUrl('');
        } else {
          this.errMessage = res;
        }
      });

  }

  ngOnInit() {
    this.nametodoFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      
    });
    this.descriptionFormGroup = this._formBuilder.group({
      description: ['', Validators.required]
    });
  }
  

}

// component modal  de  modification de l'element selection
// supression  && modification
@Component({
  selector: 'itemlist',
  templateUrl:'itemlist.html',
  styleUrls: ['itemlist.css']
})
export class ItemlistComponent { 
   title:string;
   constructor(
      public dialogRef: MatDialogRef<ItemlistComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any ,private _formBuilder: FormBuilder) {
       
       }
       onNoClick(): void {
        this.dialogRef.close();
      
      }
  
}
