import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent, ItemlistComponent, FormtodolistComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginGuardGuard } from './login-guard.guard';
import { AuthService } from './auth.service';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TodolistComponent, TodoComponent } from './todolist/todolist.component';
import { AddtodoComponent, FormtodoComponent } from './addtodo/addtodo.component';
import { AuthHttp, AuthConfig,JwtHelper } from 'angular2-jwt';
import { ListtodoService } from './listtodo.service';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { FlexLayoutModule } from '@angular/flex-layout';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    TodolistComponent,
    TodoComponent,
    AddtodoComponent,
    FormtodoComponent,
    FormtodolistComponent,
    ItemlistComponent,
   
   

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    DragulaModule,
    FlexLayoutModule,
   
 
  ],
  entryComponents: [ 
    TodoComponent,
    FormtodoComponent,
    FormtodolistComponent,
    ItemlistComponent
  ],
  providers: [LoginGuardGuard, AuthService,ListtodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
