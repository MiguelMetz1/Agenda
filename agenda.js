

const app1 = new Vue({
	
	el: '#app1',

	data: {
		
		usuario_a_elegir: '',

		usuario_actual: {
						id: 0,
						nombre_usuario:''
					},
		
		eventos_usuario_actual: [],

		usuarios_registrados: [],
					/*[  // MODELO
					{id: 0, nombre_usuario:'Miguel'},
					{id: 1, nombre_usuario:'Gabriel'},
					{id: 2, nombre_usuario:'Juan'}
					],*/

		cantidad_usuarios: 0,//this.usuarios_registrados.length,

		usuario_nuevo: {
			id: 0,
			nombre_usuario:''
		},



		form_nuevo_usuario: false,



		dias: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],



		registro_eventos: [  // MODELO
			{
				usuario: {id: 0, nombre_usuario: ''},
				eventos: [
					{
						id: 0,
						dia:'',
						hora: '',
						titulo: '',
						descripcion: '',
						pendiente: true
					}
				]
			}
		],

		id_evento: 0,

		// NUEVO EVENTO
		hs: '',
		mm: '',
		titulo: '',
		descripcion: '',

		form_nuevo_evento: false,
		dia_del_nuevo_evento: '',

		mostrar_evento: false,

		// EVENTO A MOSTRAR
		a_mostrar_id: 0,
		a_mostrar_titulo: '',
		a_mostrar_dia: '',
		a_mostrar_hora: '',
		a_mostrar_hs: '',
		a_mostrar_mm: '',
		a_mostrar_descripcion: '',
		a_mostrar_pendiente: true,

		editar_evento: false
	},

	methods: {


		set_usuario_actual(){

			for (let i = 0; i < this.usuarios_registrados.length; i++) {
				
				if ( this.usuarios_registrados[i].nombre_usuario == this.usuario_a_elegir ) {
					this.usuario_actual.id = this.usuarios_registrados[i].id;
					this.usuario_actual.nombre_usuario = this.usuarios_registrados[i].nombre_usuario;

					this.usuario_a_elegir = '';

					this.eventos_usuario_actual = this.registro_eventos[this.usuarios_registrados[i].id].eventos;

					this.id_eventos = this.eventos_usuario_actual.length;

					break;
				}
			}
		},


		nuevo_evento(dia_seleccionado){

			if (this.mm == '') {
				this.mm = '00';
			}

			let evento_nuevo = {
				id: this.id_eventos,
				dia: dia_seleccionado,
				hora: this.hs + ':' + this.mm,
				titulo: this.titulo,
				descripcion: this.descripcion,
				pendiente: true
			}

			this.id_eventos++;

			this.eventos_usuario_actual.push(evento_nuevo);

			let actualizar_registro = {usuario: this.usuario_actual, eventos: this.eventos_usuario_actual};

			this.registro_eventos[this.usuario_actual.id] = actualizar_registro;

			localStorage.setItem('registro_eventos_local', JSON.stringify(this.registro_eventos));

			this.hs = '';
			this.mm = '';
			this.titulo = '';
			this.descripcion = '';
		},


		validar_nuevo_usuario(nombre_usuario){

			let valido = true;

			if ( nombre_usuario == '' ) {
				valido = false;
			}

			let numeros = '0123456789';
			let letras_min = 'abcdefghijklmnñopqrstuvwxyz';
			let letras_may = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

			let j = 0;
			let character;
			character = nombre_usuario[j];

			while ( valido && (j < nombre_usuario.length) ) {

				if ( !(numeros.includes(character)) && !(letras_min.includes(character)) && !(letras_may.includes(character)) ) {

					valido = false;
				}

				j++;
				character = nombre_usuario[j];

			}

			for (let i = 0; i < this.usuarios_registrados.length; i++) {
				
				if (this.usuarios_registrados[i].nombre_usuario == nombre_usuario) {
					valido = false;
				}
			}

			return valido;
		},


		crear_cuenta(){
			
			if ( this.validar_nuevo_usuario(this.usuario_nuevo.nombre_usuario) ) {

				this.usuario_nuevo.id = this.cantidad_usuarios;
				console.log(this.cantidad_usuarios);
				this.cantidad_usuarios++;
				console.log(this.cantidad_usuarios);

				this.usuarios_registrados.push(this.usuario_nuevo);
				localStorage.setItem('usuarios_registrados_local', JSON.stringify(this.usuarios_registrados));

				let nuevo_registro = {usuario: this.usuario_nuevo, eventos: []};
				this.registro_eventos.push(nuevo_registro);
				localStorage.setItem('registro_eventos_local', JSON.stringify(this.registro_eventos));

				localStorage.setItem('cantidad_usuarios', JSON.stringify(String(this.cantidad_usuarios++)))

				this.form_user_display = false;

				this.id_eventos = 0;
			}
		},


		show_event(ev){
			this.a_mostrar_id = ev.id;
			this.a_mostrar_titulo= ev.titulo;
			this.a_mostrar_dia= ev.dia;
			this.a_mostrar_descripcion= ev.descripcion;
			this.a_mostrar_pendiente = ev.pendiente;
			this.a_mostrar_hora= ev.hora;

			let hora = true;
			this.a_mostrar_hs = '';
			this.a_mostrar_mm = '';

			console.log(ev.hora)
			console.log(this.a_mostrar_hs);
			console.log(this.a_mostrar_mm);
				
			
			for (let i = 0; i < (ev.hora).length; i++) {

				if ( ((ev.hora)[i] != ':') && hora ) {
					this.a_mostrar_hs += (ev.hora)[i];
				} else if ( (ev.hora)[i] == ':' ) {
					hora = false;
				} else if ( ((ev.hora)[i] != ':') && !hora ) {
					this.a_mostrar_mm += (ev.hora)[i];
				}
			}
			console.log(ev.hora)
			console.log(this.a_mostrar_hs);
			console.log(this.a_mostrar_mm);
		},


		set_evento_hecho(){
			this.eventos_usuario_actual[this.a_mostrar_id].pendiente = false;

			let actualizar_registro = {usuario: this.usuario_actual, eventos: this.eventos_usuario_actual};

			this.registro_eventos[this.usuario_actual.id] = actualizar_registro;

			localStorage.setItem('registro_eventos_local', JSON.stringify(this.registro_eventos));
		},


		eliminar_evento() {

			for (let i = this.a_mostrar_id; i < this.eventos_usuario_actual.length-1; i++) {
				
				this.eventos_usuario_actual[i] = this.eventos_usuario_actual[i+1];
				this.eventos_usuario_actual[i].id--;
			}
			this.id_eventos--;

			this.eventos_usuario_actual.pop();
			
			let actualizar_registro = {usuario: this.usuario_actual, eventos: this.eventos_usuario_actual};

			this.registro_eventos[this.usuario_actual.id] = actualizar_registro;

			localStorage.setItem('registro_eventos_local', JSON.stringify(this.registro_eventos));
		},


		editar_evento_actual() {

			let evento = this.eventos_usuario_actual[this.a_mostrar_id];
			evento.dia = this.a_mostrar_dia;
			evento.hora = this.a_mostrar_hs+':'+this.a_mostrar_mm;
			evento.titulo = this.a_mostrar_titulo;
			evento.descripcion = this.a_mostrar_descripcion;

			console.log(this.eventos_usuario_actual[this.a_mostrar_id]);

			this.eventos_usuario_actual[this.a_mostrar_id] = evento;
			console.log(this.eventos_usuario_actual[this.a_mostrar_id]);

			let actualizar_registro = {usuario: this.usuario_actual, eventos: this.eventos_usuario_actual};

			this.registro_eventos[this.usuario_actual.id] = actualizar_registro;

			localStorage.setItem('registro_eventos_local', JSON.stringify(this.registro_eventos));
		}
	},

	created(){  // metodo llamado al crearse el objeto Vue
		
		let data_usuarios = JSON.parse(localStorage.getItem('usuarios_registrados_local'));
		
		if ( data_usuarios == null ) {
			this.usuarios_registrados = [];
		} else {
			this.usuarios_registrados = data_usuarios;
		}


		let data_registro = JSON.parse(localStorage.getItem('registro_eventos_local'));
		
		if ( data_registro == null ) {
			this.registro_eventos = [];
		} else {
			this.registro_eventos = data_registro;
		}

		let cantidad_usuarios = JSON.parse(localStorage.getItem('cantidad_usuarios'));
		
		if ( cantidad_usuarios == null ) {
			this.cantidad_usuarios = 0;
		} else {
			this.cantidad_usuarios = parseInt(cantidad_usuarios);
		}
	}



})