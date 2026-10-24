
 const provincias = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
  'Tucumán',
];

const entities = {
  examen: {
    fecha: {
      name: 'fecha',
      type: 'date',
      label: 'Fecha',
      required: true,
      cols: '6'
    },
    ubicacion: {
      type: 'group',
      items: {
        ubicacion_calle: {
          name: 'ubicacion_calle',
          type: 'text',
          label: 'Calle o ruta',
          required: true,
          cols: '6'
        },
        ubicacion_nro: {
          name: 'ubicacion_nro',
          type: 'text',
          label: 'Nro o Km',
          cols: '3'
        }
      }
    },
    ubicacion_localidad: {
      type: 'group',
      items: {
        ubicacion_localidad: {
          name: 'ubicacion_localidad',
          type: 'text',
          label: 'Localidad',
          cols: '6'
        },
        ubicacion_provincia: {
          name: 'ubicacion_provincia',
          type: 'select',
          label: 'Provincia',
          cols: '6',
          options: provincias
        },
      }
    },
    hora: {
      type: 'group',
      items: {
        hora_inicio: {
          name: 'hora_inicio',
          type: 'text',
          label: 'H. Inicio',
          cols: '6'
        },
        hora_finalizacion: {
          name: 'hora_finalizacion',
          type: 'text',
          label: 'H. Finalización',
          cols: '6'
        },
      }
    },
    calificaciones: {
      type: 'group',
      items: {
        calificacion_caracteres: {
          name: 'calificacion_caracteres',
          type: 'number',
          label: 'Total CW',
          required: true,
          cols: '6',
        },
        calificacion_preguntas: {
          name: 'calificacion_preguntas',
          type: 'number',
          label: 'Total Preguntas',
          required: true,
          cols: '6'
        },
      }
    }
  },
  veedores: {
    apellido: {
      name: 'apellido',
      type: 'text',
      label: 'Apellidos',
      required: true,
      width: '200px'
    },
    nombre: {
      name: 'nombre',
      type: 'text',
      label: 'Nombres',
      required: true,
      width: '200px'
    },
    dni: {
      name: 'dni',
      type: 'text',
      label: 'DNI',
      required: true
    },
    licencia: {
      name: 'licencia',
      type: 'text',
      label: 'Licencia'
    },
  },
  examinadores: {
    apellido: {
      name: 'apellido',
      type: 'text',
      label: 'Apellidos',
      required: true,
      width: '200px'
    },
    nombre: {
      name: 'nombre',
      type: 'text',
      label: 'Nombres',
      required: true,
      width: '200px'
    },
    dni: {
      name: 'dni',
      type: 'text',
      label: 'DNI',
      required: true
    },
    licencia: {
      name: 'licencia',
      type: 'text',
      label: 'Licencia'
    },
  },
  radioclubes: {
    nombre: {
      name: 'nombre',
      type: 'text',
      label: 'Radio club',
      required: true
    },
    depositario: {
      name: 'depositario',
      type: 'checkbox',
      label: 'Depositario'
    }
  },
  participantes: {
    apellido: {
      name: 'apellido',
      type: 'text',
      label: 'Apellidos',
      required: true,
      width: '240px'
    },
    nombre: {
      name: 'nombre',
      type: 'text',
      label: 'Nombres',
      required: true,
      width: '240px'
    },
    dni: {
      name: 'dni',
      type: 'text',
      label: 'DNI',
      required: true,
      width: '120px'
    },
    ascenso_licencia: {
      name: 'ascenso_licencia',
      type: 'text',
      label: 'Licencia',
      width: '100px'
    },
    ascenso_categoria_actual: {
      name: 'ascenso_categoria_actual',
      type: 'text',
      label: 'Categoría',
      width: '120px'
    },
    calificacion_caracteres: {
      name: 'calificacion_caracteres',
      type: 'text',
      label: 'Correctos',
      required: true,
      width: '80px'
    },
    calificacion_cw_porcentaje: {
      name: 'calificacion_cw_porcentaje',
      type: 'text',
      label: '(%)',
      required: false,
      width: '80px',
      disabled: true
    },
    calificacion_cw_aprobado: {
      name: 'calificacion_cw_aprobado',
      type: 'select',
      label: 'Aprobó (SI / NO)',
      required: false,
      options: ['SI', 'NO'],
      width: '80px',
      disabled: true
    },
    calificacion_respuestas: {
      name: 'calificacion_respuestas',
      type: 'text',
      label: 'Correctas',
      required: true,
      width: '80px'
    },
    calificacion_escrito_porcentaje: {
      name: 'calificacion_escrito_porcentaje',
      type: 'text',
      label: '(%)',
      required: false,
      width: '80px',
      disabled: true
    },
    calificacion_escrito_aprobado: {
      name: 'calificacion_escrito_aprobado',
      type: 'select',
      label: 'Aprobó (SI / NO)',
      required: false,
      options: ['SI', 'NO'],
      width: '80px',
      disabled: true
    }
  }
}

module.exports = { provincias, entities }
