import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }


  addTask(formData: NgForm) {
    this.userService.getUserBehaveSub().subscribe({
      next: (res) => {
        let taskObj={
          username:res.username,
          taskCollection:[formData.value]
        }
        this.userService.adduserTask(taskObj).subscribe({
          next:(res)=>{console.log(res)},
          error:(err)=>console.log('error is ', err)
        })
        
      },
      error: (err) => console.log(err)
    })


  }
}
