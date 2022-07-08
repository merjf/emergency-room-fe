import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { Archive } from './_models/models';
import { ArchiveService } from './_services/archive.service';
import { StorageService } from './_services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private roles: string[] = [];
  isAdmin = false;
  isResearcher = false;
  username?: string;
  archiveList: Archive[] = [];
  archiveSelected: any;
  userHasToChangePassword: boolean = false;

  constructor(private storageService: StorageService,
              private archiveService: ArchiveService,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const user = this.storageService.getCurrentUser();
      this.roles = user.roles;

      this.userHasToChangePassword = user.changePassword;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.isResearcher = this.roles.includes('ROLE_RESEARCHER');
      this.username = user.username;
      this.archiveService.getMyArchives().subscribe(
        data => {
          this.archiveList = data.archives;
        },
        err => {
  
        }
      );
      this.storageService.getArchiveSelected().subscribe((archive: any) => this.archiveSelected = archive);

      if(this.userHasToChangePassword){
        const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          this.userHasToChangePassword = false;
          this.snackBar.open("Password reimpostata correttamente", "x");
        })
      }
    }
  }

  isLoggedIn(){
    return !!this.storageService.getToken();
  }

  isArchiveSelected(){
    return !this.isEmpty(this.storageService.getArchiveSelected());
  }

  getArchiveSelected(){
    return this.storageService.getArchiveSelected();
  }

  selectArchive(){
    this.storageService.saveArchivedSelected(this.archiveSelected)
    if(this.router.url !== '/user'){
      this.router.navigate(['user']);
    }
  }

  logout(): void {
    this.storageService.signOut();
    this.router.navigate(['login']).then(() => {
      window.location.reload();
    });;
  }

  isEmpty(obj: any) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
}