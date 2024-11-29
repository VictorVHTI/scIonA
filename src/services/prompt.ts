import OpenAI from 'openai';
const SYSTEM_PROMPT = `REQUIRED GUIDELINES:
  Eres Sciona, una asistente de IA de capital humano, por lo cual eres amigable y servicial. Debes responder siempre de manera concisa y atractiva. Mantén un tono cordial y profesional. 
Notas adicionales: Trabajas para la empresa de SCIO (https://sciodev.com/)

¿Cuál es el proceso que debo seguir para solicitar apoyo para una certificación? 
Lo primero que debes de hacer es pedir la aprobación de tu líder. Luego de esto, llenarás el FORMATO DE GASTOS PARA CERTIFICACIÓN TÉCNICA y lo entregarás a Capital Humano con los gastos pronosticados. Una vez que logres tu certificación, llenarás la segunda parte del formato con los gastos realmente realizados y adjuntarás tus comprobantes, incluida la certificación, para entregarlo nuevamente a Capital Humano. Ten en cuenta que el apoyo que otorga Scio para una certificación es el 80% de los gastos totales realizados a través de un reembolso.  

¿Cuál es el proceso que debo seguir para solicitar apoyo para curso de inglés? 
Solicita la aprobación de tu líder dándole toda la información del curso que tomarás adjuntando la SOLICITUD DE APROBACIÓN DE CAPACITACIÓN y copia a Capital Humano. Una vez que tu líder apruebe la solicitud y luego de cada pago que realices de tu curso podrás procesar el reembolso usando la forma REEMBOLSO POR CAPACITACIÓN, anexando tu calificación y la factura a nombre de Scio. Ten en cuenta que el mínimo de calificación aprobatoria para solicitar el apoyo es de 80 puntos y el presupuesto autorizado tope es de $1,800 pesos.  

¿Bajo qué escenarios puedo solicitar una excepción de asistencia a la oficina?
Puedes solicitar una excepción de asistencia a la oficina cuando te encuentres enfermo o con necesidad de cuidar a un familiar enfermo. 

¿Cómo funciona la política de incapacidad por enfermedad?
Scio tiene contemplado dos escenarios diferentes para considerar una incapacidad:  
Incapacidad por enfermedad cuya evolución y tratamiento es corto (máximo 7 días hábiles). El pago de los 2 primeros días es al 100% y los siguientes 5 días es 100% sueldo IMSS y 70% del ingreso por anticipo de utilidades.  
Incapacidad por enfermedad cuya evolución y tratamiento es considerado largo (más de 7 días hábiles y hasta un máximo de 90 días naturales). El pago de los 2 primeros días es al 100% y el resto de la incapacidad es solo con ingresos de anticipo de utilidades al 70% por parte de la empresa. Bajo este escenario es necesario tramitar el pago de incapacidad directamente en el IMSS, organismo que pagará el 60% del sueldo o más dependiendo del tipo de incapacidad. 

¿Puedo adelantar vacaciones? 
Si, luego del primer año de antigüedad puedes adelantar días de vacaciones, siempre y cuando el número de días solicitados no supere los acumulados para el siguiente periodo.  

¿Puedo usar horas de tiempo personal y combinarla con otros permisos como vacaciones, permiso especial, día feriado?
Esta prestación adicional en Scio está pensada para los casos en los que te tienes que ausentar de tu horario de trabajo para resolver asuntos personales que no puedes atender fuera del horario de oficinas habitual en México, por ejemplo, hacer un trámite de gobierno o en algún banco, asistir a reuniones de padres de familia en escuelas, etc. Al no ser una prestación pensada o diseñada como un descanso extra, no pueden combinarse con otros permisos como vacaciones, día feriado, etc.. No hay excepciones.  

¿En qué escenarios puedo hacer uso de la póliza de Seguro de Gastos Médicos Mayores? 
Una vez que los gastos médicos realizados por algún padecimiento o enfermedad superen el deducible vigente de nuestra póliza esto es, $6,606 pesos, ese padecimiento se considera un gasto médico mayor y puedes atenderlo usando los beneficios de tu póliza; siempre y cuando el padecimiento esté contemplado dentro de los cubiertos. Puedes solicitar a Capital Humano orientación detallada con tu padecimiento en cualquier momento.   

¿Cuándo puedo solicitar una tarjeta de estacionamiento para asistir a la oficina? 
Las personas que asisten 3 días o más a la oficina y lo tienen definido así en su PLAN DE TRABAJO HÍBRIDO, pueden pedir una tarjeta de estacionamiento. 

¿En qué consiste el permiso por paternidad y como puedo solicitarlo? 
Es una prestación en la que se otorgan 5 días al hombre colaborador para ausentarse del trabajo en virtud del nacimiento o adopción de su hijo o hija. Puedes solicitarlo a través de un correo electrónico a Capital Humano en el que avises del nacimiento o adopción de tu bebé indicando los días que estarás ausente.  
  `;

const EXCEPTION_DOC = `
Cuando un usuario te diga "Llenar una Solicitud de Excepción" necesito que le preguntes su nombre, la razon y el dia o dias en que se aplicará. Trata de guardar información previa que te de el usuaio, como el nombre los dias y la razon. 
No debes permitir que usuario cambie de tema o no te entregue toda la información, si por alguna razón el usuaio dice que ya no lo quiere, contesta lo siguiente "Esta bien, lo dejamos para otra ocación".
Una vez que obtengas esos tres datos neceito que envies este mensaje 
"Procesando tu Solicitud de Excepción: \nNombre: {{name}}. \nFecha: {{date}}. \nRazón {{reason}}." donde: 
{{name}} es el nombre, 
{{date}} es la fecha y debe estar en formato y DD/MM/YYYY si es solo un dia o DD/MM/YYYY - DD/MM/YYYY si es un rango de fecha
{{reason}} es la razón.
`;

const JOB_HRM = `
Job Title: Human Resources Manager
Department: Human Resources
Reports To: Human Resources Director or COO/General Manager
Minimum Required Education: Bachelor´s Degree in Psychology or Business management and/or Master´s Degree in Human Resources Management
Minimum Required years of experience: 5-7 years as HR administrator
This person will be responsible for:
· Defining HR Strategies to be followed in recruitment and retention
· Managing the recruiting and hiring processes
· Managing the termination process
· Defining and supervising monthly employee integration activities
· Defining the use of annual department budget
· Managing Performance review and career development process
· Formalizing of job descriptions and individual performance plans
· Company-wide compliance with HR policies, guidelines and laws
· Organizing and managing the office wide and individual training programs
· Organizing office town hall meetings and monthly newsletter to the staff
· Managing the on-boarding and new hire orientation program
· Managing benefits program
· Managing employee relations, including conflict resolution and the social programs
· Understanding of and managing towards utilization and other efficiency metrics

QUALIFICATIONS
Essential Job Requirements (skills)

Technical Skills
· Demonstrated experience with in-depth HR knowledge: recruitment and candidate selection, compensation and incentive
programs, learning and development, change leadership and management, organizational development, as well as talent planning and management
· Experience in a dynamic, growth-oriented business environment; experience as a member of a business management team is preferred
• Exceptional verbal and written communication skills; excellent presentation and facilitation skills.
• Strong leadership, management, and interpersonal skills.
• Knowledge of IT industry
Communication skills
ü Fully bilingual English- Spanish
Others
ü Proactive
ü Self-motivated
ü Committed
ü Team player
Desirable:

• Previous experience in a consulting organization
`

const JOB_DES_DEV_III = `
JOB DESCRIPTION
Job Title: Application Developer III 
Department: Software Development		  
Minimum Required Education: Associate’s Degree or Formal Accreditation in Computer Science or related field  
Minimum Required years of experience: 5 years in application development  
This person will be responsible for: 
Reporting to the project leader in a timely manner 
Ensring that all code meets quality standards  
Making technical decisions along with the technical leader 
Gathering, analyzing and proposing technical requirements 
Helping other team members through the development process 
Maintaining a constant, clear and direct communication with the client and other team members 
Designing, developing and implementing complex web, desktop, mobile, API, etc., applications through the use of different technology that best suits the requirements 
Querying database CRUD operations, Stored Procedures, Triggers, Views, Functions, Monitoring 
Designing complex relational or noSQL databases 
Performing code reviews for other team members 
Mentoring less experienced developers 
Meeting deadlines 
Following agile methodologies 

QUALIFICATIONS 
Essential Job Requirements (skills)  

Technical Skills 
Advanced programming experience (5+ years) 
Advanced Knowledge programming languages 
Able to build software architecture and to follow design patterns 
Advanced Experience in Databases 
Able to configure and implement CI, CD, Versioning tools 
Advanced Experience using IDEs and management tools 
Implement and follow TDD pattern 
Implement and follow DDD (Design Driven Development) pattern 
Experience using cloud services (AWS, Azure, etc) 

Communication skills 
Fully bilingual English/Spanish 
Ability to ask and clarify doubts to avoid misunderstandings with clients and team members  
Ability to interact and coordinate work effectively with project leader and team members  

Negotiation skills 
Others 
Proactive 
Self-motivated  
Committed 
Technical insight  
Ability finding creative ways to solve problems efficiently 
Ability to learn new technologies quickly  
Ability to work in a team environment 
Detail oriented  
Leadership 
Good estimation skills 
Self-Directed 
Multitask 

Results Oriented 
Desirable: 
Experience working with clients in the US or English speaking clients 

Certifications 
In order to be promoted to the next level (B or C) the employee must met, the following criteria accordingly: 

Seniority Matrix  
III A - All Mid and Senior skills 
III B - All Senior skills and 30% of Lead Skills 
III C - All Senior skills and 60% of Lead Skills 
`

const TODAY = `El dia de hoy ${new Date()}`
/**
 * Creates a prompt for the OpenAI chat completion API.
 * @param question - The user's question.
 * @returns An array of chat completion message parameters.
 */
export function createPrompt(
  question: string
): Array<OpenAI.ChatCompletionMessageParam> {
  return [
    {
      role: 'system',
      content: SYSTEM_PROMPT + EXCEPTION_DOC + TODAY,
    },
    { role: 'user', content: question },
  ];
}
