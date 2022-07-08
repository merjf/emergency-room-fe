import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Verbale, Color, Filters, Sesso } from '../_models/models';
import { StorageService } from '../_services/storage.service';
import { VerbaleService } from '../_services/verbale.service';

@Component({
  selector: 'app-access-list',
  templateUrl: './access-list.component.html',
  styleUrls: ['./access-list.component.scss']
})
export class AccessListComponent implements OnInit {

  displayedColumns: string[] = ['colore', 'numeroAccesso', 'paziente', 'problemaAccesso', 'dataAccesso',
    'dataDimissione', 'diagnosiDimissione', 'esitoTrattamento', 'download'];
  archiveSelected: any;
  dataAccesso = this.getEmptyFormGroup();
  dataNascita = this.getEmptyFormGroup();
  dataDimissione = this.getEmptyFormGroup();
  pageIndex: number;
  pageSize: number;
  listLength: number;
  verbali = new MatTableDataSource<Verbale>([]);
  pageEvent: PageEvent;
  filterForm: Filters = new Filters();
  pagination: number[];
  isDownloading: boolean[] = [];
  downloadActive = false;
  isTableLoading = true;

  constructor(private verbaleService: VerbaleService,
            private storageService: StorageService) { }
  
  ngOnInit(): void {
    this.storageService.getArchiveSelected().subscribe((archive: { source: { value: any; }; }) => {
      this.archiveSelected = archive
      this.pageIndex = 0;
      this.pageSize = 25;
      this.listLength = 0;
      if(this.archiveSelected && this.archiveSelected !== 'undefined'){
        this.getVerbali();
      } else {
        
      }
    })
  }

  getColors(){
    return Object.keys(Color);
  }

  getSessi(){
    return Object.keys(Sesso);
  }

  applyFilters(){
    this.dataAccesso.value.start ? this.filterForm.dataAccessoStart = this.formatDate(this.dataAccesso.value.start) : null;
    this.dataAccesso.value.end ? this.filterForm.dataAccessoEnd = this.formatDate(this.dataAccesso.value.end) : null;
    this.dataDimissione.value.start ? this.filterForm.dataDimissioneStart = this.formatDate(this.dataDimissione.value.start) : null;
    this.dataDimissione.value.end ? this.filterForm.dataDimissioneEnd = this.formatDate(this.dataDimissione.value.end) : null;
    this.dataNascita.value.start ? this.filterForm.dataNascitaStart = this.formatDate(this.dataNascita.value.start) : null;
    this.dataNascita.value.end ? this.filterForm.dataNascitaEnd = this.formatDate(this.dataNascita.value.end) : null;

    this.filterForm = this.cleanFilters(this.filterForm);
    this.getVerbali();
  }

  isArchiveSelected(){
    if(this.storageService.getArchiveSelected().source._value){
      return true;
    }
    return false;
  }

  getVerbali(event?: PageEvent){
    this.isTableLoading = true;
    this.populatePagination(event);
    this.verbaleService.getVerbali(this.archiveSelected.id, this.filterForm, this.pagination).subscribe(
      data => {
        this.verbali = data.verbali;
        this.pageIndex = data.pagination.currentPage;
        this.listLength = data.pagination.listLength;
        this.pageSize = data.pagination.currentNItems;
        this.isTableLoading = false;
      },
      err => {
      }
    )
    if(!this.isArchiveSelected()){
      this.isTableLoading = true;
    }
    return event as PageEvent;
  }

  download(numeroAccesso: any, index: any){
    this.isDownloading[index] = true;
    this.downloadActive = true;
    this.verbaleService.downloadVerbale(this.archiveSelected.id as number, numeroAccesso).subscribe(
      data => {
        const file = new Blob([data], {
          type: 'application/pdf',
        });
        var fileURL = URL.createObjectURL(file);
        this.isDownloading[index] = false;
        this.downloadActive = false;
        window.open(fileURL);
      },
      err => {
        this.isDownloading[index] = false;
        this.downloadActive = false;
      }
    )
  }

  populatePagination(event?: PageEvent){
    this.pagination = [];
    if(event && event !== undefined){
      this.pagination.push(event.pageSize);
      this.pagination.push(event.pageIndex);
    } else {
      this.pagination.push(this.pageSize);
      this.pagination.push(this.pageIndex);
    }
  }

  getEmptyFormGroup(){
    return new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    });
  }

  cleanFilters(filters: any) {
    for (var propName in filters) {
      if (filters[propName] === null || filters[propName] === undefined || filters[propName] === "") {
        delete filters[propName];
      }
    }
    return filters;
  }

  clearFilters(){
    this.filterForm = new Filters();
    this.dataAccesso = this.getEmptyFormGroup();
    this.dataDimissione = this.getEmptyFormGroup();
    this.dataNascita = this.getEmptyFormGroup();
  }

  formatDate(date: any) {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${year}/${month}/${day}`;
  }
}
