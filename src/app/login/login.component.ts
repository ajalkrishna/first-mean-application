import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginErrorObj={
    error:false,
    errorMsg:''
  }

  constructor(private userService:UserService,private rout:Router) { }

  ngOnInit(): void {
  }

  onLogin(formData:NgForm){
    console.log(formData.value);
    // performing Login Operation
    this.userService.loginUser(formData.value).subscribe({
      next:(res)=>{
        // if invalid response
        if(res.message!=='Login successful'){
          this.loginErrorObj.error=true
          this.loginErrorObj.errorMsg=res.message

        }
        else{
          // successful login
          // save token to the local storage
          localStorage.setItem('token',res.token)
          // update userBehaviourSub with userObj 
          this.userService.getUserBehaveSub().next(res.user)
          // navigate to userProfileComponent
          this.rout.navigateByUrl(`userprofile/${res.user.username}`)

        }
      },
      error:(err)=>alert('something went wrong')
    })
    
  }

}
