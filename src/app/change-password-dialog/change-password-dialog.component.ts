import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';

const mustMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPsw = control.get('newPsw');
  const confirmPsw = control.get('confirmPsw');
  return newPsw && confirmPsw && newPsw.value !== confirmPsw.value ? { mustMatch: true } : null;
};

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  changePasswordForm: FormGroup = new FormGroup({});
  userHasToChangePassword: boolean = false;
  
  constructor(private userService: UserService,
    private storageService: StorageService,
    private router: Router,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      const user = this.storageService.getCurrentUser();

      this.userHasToChangePassword = user.changePassword;

      this.changePasswordForm = new FormGroup({
        newPsw: new FormControl("", Validators.compose([
          Validators.required,
          UserService.patternValidator(/\d/, { hasNumber: true }),
          UserService.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          UserService.patternValidator(/[a-z]/, { hasSmallCase: true }),
          Validators.minLength(8)])
        ),
        confirmPsw: new FormControl("", Validators.compose([
          Validators.required,
          UserService.patternValidator(/\d/, { hasNumber: true }),
          UserService.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          UserService.patternValidator(/[a-z]/, { hasSmallCase: true }),
          Validators.minLength(8)])
        )}, {
          validators: mustMatch
      });
  }

  ngOnInit(): void {
  }

  changePassword(){
    this.userService.changePassword(this.changePasswordForm.controls.confirmPsw.value).subscribe(
      data => {
        if(data.users.length > 0){
          this.storageService.saveCurrentUser(data.users[0]);
          this.dialogRef.close(true);
        }
      }, 
      err => {

    });
  }

  logout(): void {
    this.storageService.signOut();
    this.router.navigate(['login']).then(() => {
      window.location.reload();
    });;
  }
}
