import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { Archive } from '../_models/models';
import { ArchiveService } from '../_services/archive.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  myArchives: Archive[] = []
  archiveSelected: any;
  currentUser: any;
  userHasToChangePassword: boolean = false;

  constructor(private archiveService: ArchiveService,
    private storageService: StorageService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }
    
  ngOnInit(): void {
    this.getMyArchives();
    this.currentUser = this.storageService.getCurrentUser();
  }

  getMyArchives(){
    this.archiveService.getMyArchives().subscribe(
      data => {
        this.myArchives = data.archives;
      },
      err => {

      }
    )
  }

  isArchiveSelected(){
    return this.storageService.getArchiveSelected() !== null;
  }

  selectArchive(){
    this.storageService.saveArchivedSelected(this.archiveSelected[0]);
    this.router.navigate(['user']);
  }

  getRole(role: String){
    if(role === 'ROLE_ADMIN')
      return "Administrator";
    else if(role === 'ROLE_RESEARCHER')
      return 'Researcher'
    else return null;
  }

  isResearcher(){
    return this.currentUser.roles.includes('ROLE_RESEARCHER');
  }

  isAdmin(){
    return this.currentUser.roles.includes('ROLE_ADMIN');
  }

  showChangePasswordPanel(){
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.snackBar.open("Password reimpostata correttamente", "x"); 
      }
    })
  }
}