# Spec: API de Sistema de Gestión Académica (v1.0)

## 1. Resumen del Proyecto
El objetivo de este microservicio es gestionar el núcleo académico de una institución educativa. Permite la administración de materias, el registro de docentes y alumnos, y la orquestación de las inscripciones (matrículas). 

**Alcance de esta iteración:** Gestión básica de las entidades principales y sus relaciones de vinculación (inscripciones y asignaciones). *El sistema de autenticación, manejo de sesiones y control por roles quedan fuera del alcance de esta versión.*

---

## 2. Entidades del Dominio

### 2.1. Materia
| Campo | Tipo de Dato | Reglas de Validación | Descripción |
| :--- | :--- | :--- | :--- |
| `codigo` | Texto | Obligatorio, Único, Mayúsculas | Código identificador interno (Ej: MAT-101) |
| `nombre` | Texto | Obligatorio, Sin espacios residuales | Nombre oficial de la materia |
| `cargaHoraria` | Entero | Obligatorio, Valor mínimo: 10 | Horas totales del cuatrimestre |
| `estado` | Texto | Valores permitidos: ['ACTIVA', 'INACTIVA'] | Por defecto será 'ACTIVA' |

### 2.2. Docente
| Campo | Tipo de Dato | Reglas de Validación | Descripción |
| :--- | :--- | :--- | :--- |
| `legajo` | Texto | Obligatorio, Único | Identificador interno de RRHH |
| `nombreCompleto` | Texto | Obligatorio, Sin espacios residuales | Nombre y apellido |
| `email` | Texto | Obligatorio, Único, Formato de correo válido | Correo institucional |
| `materias` | Lista de Relaciones | Identificadores válidos de Materias | Materias asignadas para el dictado |

### 2.3. Alumno
| Campo | Tipo de Dato | Reglas de Validación | Descripción |
| :--- | :--- | :--- | :--- |
| `matricula` | Texto | Obligatorio, Único | Identificador estudiantil |
| `nombreCompleto` | Texto | Obligatorio, Sin espacios residuales | Nombre y apellido |
| `email` | Texto | Obligatorio, Único, Formato de correo válido | Correo de contacto |
| `inscripciones` | Lista de Relaciones | Identificadores válidos de Materias | Materias en las que se encuentra inscripto |

---

## 3. Contratos de Interfaz (API REST)

### 3.1. Gestión de Materias
*   **Crear Materia**
    *   `POST /api/materias`
    *   **Cuerpo (Payload) esperado:** `{ "codigo": "PROG-1", "nombre": "Programación 1", "cargaHoraria": 120 }`
    *   **Respuesta Exitosa (201):** Retorna la entidad creada con su identificador generado.
    *   **Errores (400):** Se rechaza si el código ya existe o si no cumple con los campos obligatorios.
*   **Listar Materias**
    *   `GET /api/materias`
    *   **Filtros soportados:** `?estado=ACTIVA` (Filtro opcional por estado).
    *   **Respuesta Exitosa (200):** Lista de materias encontradas.

### 3.2. Gestión de Alumnos e Inscripciones
*   **Registrar Alumno**
    *   `POST /api/alumnos`
    *   **Cuerpo (Payload) esperado:** `{ "matricula": "ALU-999", "nombreCompleto": "Juan Perez", "email": "juan@edu.com" }`
    *   **Respuesta Exitosa (201):** Retorna el alumno creado.
*   **Obtener Perfil del Alumno**
    *   `GET /api/alumnos/:id`
    *   **Requerimiento Especial de Lectura:** La respuesta debe incluir los datos del alumno y **resolver sus relaciones** de `inscripciones`. Es decir, en lugar de devolver solo una lista de identificadores, debe expandir la información de cada materia vinculada (mostrando al menos su `codigo` y `nombre`).
    *   **Errores (404):** Si el identificador del alumno no existe en el sistema.
*   **Matricular Alumno en Materia**
    *   `POST /api/alumnos/:id/matricular`
    *   **Cuerpo (Payload) esperado:** `{ "materiaId": "ID_DE_LA_MATERIA" }`
    *   **Lógica de Negocio:** Vincula la materia solicitada a la lista de `inscripciones` del alumno especificado.
    *   **Respuesta Exitosa (200):** `{ "mensaje": "Inscripción exitosa" }`

---

## 4. Criterios de Aceptación y Reglas de Negocio Estrictas
1. **Prevención de Duplicidad:** Un alumno **no puede** ser matriculado dos veces en la misma materia. El sistema debe validar esto y devolver un código de error HTTP `400` si detecta un intento de duplicidad.
2. **Control de Disponibilidad:** Un alumno **no puede** ser matriculado en una materia cuyo estado actual sea `INACTIVA`.
3. **Estandarización de Errores:** Todas las respuestas de error del sistema, sin importar el endpoint, deben seguir estrictamente el siguiente formato uniforme: `{ "error": true, "mensaje": "Descripción clara del motivo del fallo" }`.