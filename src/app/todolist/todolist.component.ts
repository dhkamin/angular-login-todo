import {Component, Inject,OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource} from '@angular/material';

import { ListtodoService } from '../listtodo.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements  OnInit   {
 
  displayedColumns = ['title', 'description','date','done'];
  dataSource ;
  tiles;
  position: number[];
  title: string;
  
  constructor(public dialog: MatDialog ,private listtodoservice:ListtodoService ) {
    

  }
   updateTableTodo () {
    let iduser = this.listtodoservice.useJwtHelper();
    this.listtodoservice.getTodos(iduser).subscribe((res)=>{
    this.dataSource = new MatTableDataSource<any>(res);
      console.log(this.dataSource.filteredData);
      this.tiles=  this.dataSource.filteredData;
    });
   
   }
  openDialog(row): void {
    console.log(row);
    let dialogRef = this.dialog.open(TodoComponent, {
      width: '60%',
      data: {  
        title: row.title,
        description: row.description,
        date: row.date,
        done: row.done ,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.title = result;
   
    });
  }
    ngOnInit(){
    this.updateTableTodo();
  }
 
  
}
@Component({
  selector: 'todo',
  templateUrl: 'todo.html',
})
export class TodoComponent {

  constructor(
    public dialogRef: MatDialogRef<TodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


