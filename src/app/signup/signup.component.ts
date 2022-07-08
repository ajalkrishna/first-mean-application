import { Component, OnInit,TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService,BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  //replacement for alert message
  registrationError={
    error:false,
    errorMessage:''
  }

  constructor(private fb:FormBuilder,private router:Router ,private userService:UserService,private modalService:BsModalService) { }
  userSignupForm:any
  ngOnInit(): void {
    this.userSignupForm =this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required],
      email:['',Validators.required],
      city:['']
    })
  }

  file:File
  fileName:string
  imageUrl:string | ArrayBuffer="https://bulma.io/images/placeholders/480x480.png"
  // reading the file
  fileSelected(file:File){
    this.file=file
    this.fileName=file.name
    // read file content
    const reader =new FileReader()
    reader.readAsDataURL(file)

    reader.onload=()=>{
      this.imageUrl=reader.result
    }
    
    
  }

  onSubmit(template:TemplateRef<any>){

    // take form Obj
    let signupObj =this.userSignupForm.value
    // create form data object
    let formData = new FormData()
    // append signupObj to formdata
    formData.append('signupObj',JSON.stringify(signupObj))
    // append image file
    formData.append('photo',this.file)
    
    this.userService.createUser(formData).subscribe({
      next:(res)=>{
        if(res.message=='false'){
          // alert('user already exist')
          this.registrationError.error=true;
          this.registrationError.errorMessage='userAlready exists'
        }
        else if(res.message=='true'){
          this.openModal(template)
          // alert('user created successfully')
          // navigate to loginpage
          // this.rout.navigateByUrl('login')
        }
      },
      error:(err)=>alert('Something went wrong')
      
    })
    
    
  }
  // modal
  modalRef?:BsModalRef

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.router.navigateByUrl("login")
    this.modalRef?.hide();
  }
 
  decline(): void {
   this.router.navigateByUrl("home")
    this.modalRef?.hide();
  }

  
}

