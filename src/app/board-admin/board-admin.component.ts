import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';
import { UserService } from '../_services/user.service';
import { ArchiveService } from '../_services/archive.service';
import { CreationUserInformation, User } from '../_models/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  users = new MatTableDataSource<User>([]);
  creationUserInformation: CreationUserInformation = { archives: [], roles: []};
  displayedColumns: string[] = ['name', 'surname', 'email', 'username', 'roles', 'archives', 'active'];
  
  constructor(private userService: UserService,
    private archiveService: ArchiveService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsers();
    this.getArchives();
    this.getRoles();
  }

  openCreateOrModifyUserDialog(user?: User){
    if(user){
      this.creationUserInformation.user = user;
    }
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      data: this.creationUserInformation,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
      this.creationUserInformation.user = undefined;
    });
  }

  getUsers(){
    this.userService.getUserList().subscribe(
      data => {
        this.users.paginator = this.paginator;
        this.users.data = data.users;
        for(let i = 0; i < this.users.data.length; i++){
          this.users.data[i].roles = this.userService.mapRoleToAuthority(this.users.data[i].roles);
        }
      },
      err => {
        
      }
    );
  }

  getArchives(){
    this.archiveService.getAllArchives().subscribe(
      data => {
        this.creationUserInformation.archives = data.archives
      },
      err => {

      }
    )
  }

  getRoles(){
    this.creationUserInformation.roles = ['Amministratore', 'Consultatore'];
  }
}