import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Archive, CreationUserInformation, User } from "../_models/models"
import { UserService } from "../_services/user.service";

@Component({
    selector: 'app-create-user-dialog',
    templateUrl: 'create-user-dialog.component.html',
    styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent implements OnInit{

    userForm: any;
    archivesSelected: any;
    selectedRole: string = "";
    archiveList: Archive[] = [];
    roles: string[] = this.data.roles as string[];
    user?: User = this.data.user;
    
    parametersNotValid = false;

    constructor(public dialogRef: MatDialogRef<CreateUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CreationUserInformation,
        private userService: UserService,
        private snackBar: MatSnackBar) {
            this.archivesSelected = this.user?.archives.map(function(item) {
                return item['name'];
            });
        }

    ngOnInit(): void {
        this.archiveList = this.data.archives as Archive[];
        this.roles = this.data.roles as string[];
        this.user = this.data.user as User;
        this.userForm = this.createUserForm();
    }

    createUser(){
        var user = this.userForm.value;
        user.roles = this.userService.mapRoleToAuthority(user.roles);
        user.archives = this.getArchives();
        this.userService.createUser(user).subscribe(
            data => {
                this.dialogRef.close({event: true, data:this.userForm});
                if(this.user){
                    this.openSnackBar("Utente modificato correttamente", "x");
                } else {
                    this.openSnackBar("Utente creato correttamente", "x");
                }
                this.userForm = this.createUserForm();
            },
            err => {
                this.parametersNotValid = true;
            }
        )
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action);
    }

    onArchiveRemoved(archive: String) {
        let archives = this.archivesSelected;
        this.removeFirst(archives, archive);
        this.archivesSelected = archives;
    }

    private removeFirst<T>(array: T[], toRemove: T): void {
        const index = array.indexOf(toRemove);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    private getArchives(): Archive[]{
        let archives = new Array();
        let allArchives = this.archiveList;
        this.archivesSelected.forEach((item: string) => {
            allArchives.forEach(element => {
                item === element.name ? archives.push(element) : null;
            });
        });
        return archives as Archive[];
    }

    private createUserForm(){
        if(this.user){
            return new FormGroup({
                name: new FormControl(this.user.name, [Validators.required, Validators.minLength(4)]),
                surname: new FormControl(this.user.surname, [Validators.required, Validators.minLength(4)]),
                username: new FormControl(this.user.username, [Validators.required, Validators.minLength(4)]),
                email: new FormControl(this.user.email, Validators.email),
                password: new FormControl("********", Validators.compose([
                    Validators.required,
                    UserService.patternValidator(/^((^(?=.*\d)(?=.*)(?=.*[a-z])(?=.*[A-Z]).{8,}$)|(\*\*\*\*\*\*\*\*)){1}$/, { valid: false})])),
                roles: new FormControl(this.user.roles),
                archives: new FormControl(this.user.archives),
                active: new FormControl(this.user.active),
            });
        } else {
            return new FormGroup({
                name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
                surname: new FormControl(null, [Validators.required, Validators.minLength(4)]),
                username: new FormControl(null, [Validators.required, Validators.minLength(4)]),
                email: new FormControl(null, Validators.email),
                password: new FormControl(null, Validators.compose([
                    Validators.required,
                    UserService.patternValidator(/\d/, { hasNumber: true }),
                    UserService.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
                    UserService.patternValidator(/[a-z]/, { hasSmallCase: true }),
                    Validators.minLength(8)])),
                roles: new FormControl(),
                archives: new FormControl(),
                active: new FormControl(false),
            });
        }
    }

    getErrorMessage(item: FormControl, message: String){
        if (item.hasError('required')) {
            return 'Inserire un valore';
        }
        return item.errors ? message : '';
    }
}