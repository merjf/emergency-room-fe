import { FormControl, FormGroup } from "@angular/forms"

export interface CreationUserInformation {
    archives: Archive[]
    roles: string[]
    user?: User
}

export interface Archive{
    id: string
    name: string
}

export interface Verbale{
    paziente?: String
    numeroAccesso?: number
    problemaAccesso?: String
    diagnosi?: String
    esito?: String
    colore?: Color
    dataAccesso?: String
    dataDimissione: String
}

export interface User{
    name: string,
    surname: string,
    email: string,
    username: string,
    password: string,
    archives: Archive[],
    roles: string,
    active: boolean
}

export class Filters{
    nome?: String
    cognome?: String
    codiceFiscale?: String
    numeroAccesso?: number
    sesso?: Sesso
    dataNascitaStart?: String
    dataNascitaEnd?: String
    colore?: Color
    dataAccessoStart?: String
    dataAccessoEnd?: String
    dataDimissioneStart?: String
    dataDimissioneEnd?: String
    chiaveGenerica?: String
    pagination?: number[]
}

export enum Color{
    Bianco = "Bianco",
    Giallo = "Giallo",
    Rosso = "Rosso",
    Nero = "Nero",
    Verde = "Verde"
}

export enum Sesso{
    M = "M",
    F = "F"
}