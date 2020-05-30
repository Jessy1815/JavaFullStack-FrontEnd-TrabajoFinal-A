import { Component, OnInit, Inject } from '@angular/core';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { SignosService } from 'src/app/_service/signos.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Signos } from 'src/app/_model/signos';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PacienteNuevoComponent } from '../paciente-nuevo/paciente-nuevo.component';
import { MatDialog}  from '@angular/material/dialog';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {
  signos: Signos;
  id: number;
  pacientes: Paciente[];
  maxFecha: Date = new Date();
  idPacienteSeleccionado: number;

  form: FormGroup;
  edicion: boolean = false;

  constructor(private pacienteService: PacienteService,private signosService: SignosService,private router: Router,
  private route: ActivatedRoute,private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log("Inicio");
    this.signos = new Signos();
    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': new FormControl(''),
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl('')
    });
    this.listarPacientes();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });

  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  operar(){
  
    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    let signos = new Signos();
    signos.idSignos = this.form.value['id'];
    signos.paciente=paciente;
    signos.fecha = this.form.value['fecha'];
    signos.temperatura = this.form.value['temperatura'];
    signos.pulso = this.form.value['pulso'];
    signos.ritmo = this.form.value['ritmo'];
    
    if (this.edicion) {
      this.signosService.modificar(signos).pipe(switchMap(() => {
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next("Se modificó");
      });

    } else {
      this.signosService.registrar(signos).pipe(switchMap( ()=>{
        return this.signosService.listar();
      })).subscribe( data => {
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next("Se registró");
      });
    }
    this.router.navigate(['signos']);
  }
  
  initForm() {
    if (this.edicion) {
      this.signosService.listarPorId(this.id).subscribe(data => {
        let id = data.idSignos;
        let paciente=data.paciente
        let fecha = data.fecha;
        let temperatura = data.temperatura;
        let pulso = data.pulso;
        let ritmo = data.ritmo;
        this.idPacienteSeleccionado=paciente.idPaciente;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'fecha': new FormControl(fecha),
          'temperatura': new FormControl(temperatura),
          'pulso': new FormControl(pulso),
          'ritmo': new FormControl(ritmo),
        });
        
      });
    }
  }

  abrirDialogo(): void {
    const dialogRef = this.dialog.open(PacienteNuevoComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(data => {
      this.pacientes = data;
    });
  }
    
  

}
