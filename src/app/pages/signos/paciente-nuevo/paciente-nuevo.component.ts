import { Component, OnInit, Inject } from '@angular/core';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-paciente-nuevo',
  templateUrl: './paciente-nuevo.component.html',
  styleUrls: ['./paciente-nuevo.component.css']
})
export class PacienteNuevoComponent implements OnInit {
  paciente: Paciente;
  form: FormGroup;

  constructor(private pacienteService : PacienteService,
    public dialogRef: MatDialogRef<PacienteNuevoComponent>,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.paciente = new Paciente();
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl('')
    });
  }

    operar(){
      let paciente = new Paciente();
      paciente.nombres = this.form.value['nombres'];
      paciente.apellidos = this.form.value['apellidos'];
      paciente.dni = this.form.value['dni'];
      paciente.telefono = this.form.value['telefono'];
      paciente.direccion = this.form.value['direccion'];
      this.pacienteService.registrar(paciente).pipe(switchMap( ()=>{
        return this.pacienteService.listar();
      })).subscribe( data => {
        this.dialogRef.close(data);
        let mensaje = 'Se registro paciente';
        this.snackBar.open(mensaje, "Aviso", { duration: 5000 });
        
      });
    }

  cancelar(){
    this.dialogRef.close();
  }

}
