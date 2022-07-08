import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userBehaviourSub= new BehaviorSubject(null)
  constructor(private hc:HttpClient) { }

  // get userBehaviour sub
  getUserBehaveSub(){
    return this. userBehaviourSub
  }
  // createuser
  createUser(userObj):Observable<any>{    
    return this.hc.post('http://localhost:5000/user/create-user',userObj)
  }

  // loginuser
  loginUser(userCredObj):Observable<any>{    
    return this.hc.post('http://localhost:5000/user/login',userCredObj)
  }

  // logoutUser
  logoutUser(){
    // remove the token from local storage
    localStorage.removeItem('token')
    // makes the behaviour sub as null
    this.getUserBehaveSub().next(null)
  }

  // add task
  adduserTask(taskObj):Observable<any>{
    return this.hc.post('http://localhost:5000/user/addtask',taskObj)
  }
  // updateuser

  // deleteuser
}
